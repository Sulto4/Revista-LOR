import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function extractPexelsId(url: string): string {
  const match = url.match(/pexels-photo-(\d+)/);
  return match ? match[1] : url.split('/').pop()?.split('.')[0] || 'unknown';
}

function extractUnsplashId(url: string): string {
  const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
  return match ? match[1] : url.split('/').pop()?.split('?')[0] || 'unknown';
}

async function downloadImage(url: string): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to download image: ${url}, status: ${response.status}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const data = await response.arrayBuffer();
    
    return { data, contentType };
  } catch (error) {
    console.error(`Error downloading image: ${url}`, error);
    return null;
  }
}

async function uploadToStorage(
  data: ArrayBuffer,
  fileName: string,
  contentType: string
): Promise<string | null> {
  try {
    const { error } = await supabase.storage
      .from('article-images')
      .upload(fileName, data, {
        contentType,
        upsert: true
      });
    
    if (error) {
      console.error(`Upload error for ${fileName}:`, error);
      return null;
    }
    
    const { data: publicUrl } = supabase.storage
      .from('article-images')
      .getPublicUrl(fileName);
    
    return publicUrl.publicUrl;
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, image_url')
      .or('image_url.ilike.%pexels.com%,image_url.ilike.%unsplash.com%');
    
    if (fetchError) {
      throw new Error(`Failed to fetch articles: ${fetchError.message}`);
    }
    
    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No articles with external images found', migrated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const results = {
      total: articles.length,
      migrated: 0,
      failed: 0,
      skipped: 0,
      details: [] as { id: string; title: string; status: string; newUrl?: string }[]
    };
    
    for (const article of articles) {
      const imageUrl = article.image_url;
      
      if (imageUrl.includes('supabase.co')) {
        results.skipped++;
        results.details.push({
          id: article.id,
          title: article.title,
          status: 'skipped - already on Supabase'
        });
        continue;
      }
      
      let imageId: string;
      let extension = 'jpg';
      
      if (imageUrl.includes('pexels.com')) {
        imageId = `pexels-${extractPexelsId(imageUrl)}`;
      } else if (imageUrl.includes('unsplash.com')) {
        imageId = `unsplash-${extractUnsplashId(imageUrl)}`;
      } else {
        results.skipped++;
        results.details.push({
          id: article.id,
          title: article.title,
          status: 'skipped - unknown source'
        });
        continue;
      }
      
      const downloaded = await downloadImage(imageUrl);
      
      if (!downloaded) {
        results.failed++;
        results.details.push({
          id: article.id,
          title: article.title,
          status: 'failed - could not download'
        });
        continue;
      }
      
      if (downloaded.contentType.includes('png')) {
        extension = 'png';
      } else if (downloaded.contentType.includes('webp')) {
        extension = 'webp';
      }
      
      const fileName = `${imageId}.${extension}`;
      const newUrl = await uploadToStorage(downloaded.data, fileName, downloaded.contentType);
      
      if (!newUrl) {
        results.failed++;
        results.details.push({
          id: article.id,
          title: article.title,
          status: 'failed - could not upload'
        });
        continue;
      }
      
      const { error: updateError } = await supabase
        .from('articles')
        .update({ image_url: newUrl })
        .eq('id', article.id);
      
      if (updateError) {
        results.failed++;
        results.details.push({
          id: article.id,
          title: article.title,
          status: `failed - could not update DB: ${updateError.message}`
        });
        continue;
      }
      
      results.migrated++;
      results.details.push({
        id: article.id,
        title: article.title,
        status: 'migrated',
        newUrl
      });
    }
    
    return new Response(
      JSON.stringify(results),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});