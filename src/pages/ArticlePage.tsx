import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import OptimizedImage from '../components/ui/OptimizedImage';
import { ArticlePageSkeleton } from '../components/ui/Skeleton';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
}

interface ArticlePageProps {
  slug: string;
}

const CACHE_DURATION = 30 * 60 * 1000;

function getCacheKey(slug: string) {
  return `revista_article_${slug}`;
}

function getCachedArticle(slug: string): Article | null {
  try {
    const cached = localStorage.getItem(getCacheKey(slug));
    if (!cached) return null;

    const { article, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(slug));
      return null;
    }
    return article;
  } catch {
    return null;
  }
}

function setCachedArticle(slug: string, article: Article) {
  try {
    localStorage.setItem(getCacheKey(slug), JSON.stringify({
      article,
      timestamp: Date.now()
    }));
  } catch {
  }
}

export default function ArticlePage({ slug }: ArticlePageProps) {
  const cachedData = getCachedArticle(slug);
  const [article, setArticle] = useState<Article | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching article:', error);
      } else if (data) {
        setArticle(data);
        setCachedArticle(slug, data);
      }
      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    return (
      <div className="container-revista py-section">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold text-revista-black mb-4">
            Articol negăsit
          </h1>
          <p className="text-revista-text/60">
            Ne pare rău, articolul pe care îl căutați nu există.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.published_at).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container-revista py-section">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-revista-black mb-6 md:mb-8 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-revista-text/70 mb-6 md:mb-8">
          <span className="font-medium text-revista-black">{article.author}</span>
          <span className="hidden md:inline">•</span>
          <time dateTime={article.published_at} className="block md:inline">{formattedDate}</time>
          <span>•</span>
          <a href={`#/${article.category.toLowerCase()}`} className="text-revista-gold min-h-[44px] flex items-center">
            {article.category}
          </a>
        </div>

        <div className="border-t border-revista-text/10 mb-6 md:mb-8" />

        {article.image_url && (
          <OptimizedImage
            src={article.image_url}
            alt={article.title}
            size="large"
            priority
            className="w-full aspect-[4/3] md:aspect-[16/9] mb-8 md:mb-12"
          />
        )}

        <div className="prose prose-lg max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-revista-text leading-[1.8] md:leading-relaxed mb-5 md:mb-6 text-base md:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
