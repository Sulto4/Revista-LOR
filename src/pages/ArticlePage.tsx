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
      // Ignore storage write failures to keep rendering
    }
  }

export default function ArticlePage({ slug }: ArticlePageProps) {
  const cachedData = getCachedArticle(slug);
  const [article, setArticle] = useState<Article | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);

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

  useEffect(() => {
    async function fetchRecommendedArticles() {
      if (!article) return;

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', article.category)
        .neq('id', article.id)
        .order('published_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching recommended articles:', error);
      } else if (data && data.length >= 4) {
        setRecommendedArticles(data);
      } else {
        setRecommendedArticles([]);
      }
    }

    fetchRecommendedArticles();
  }, [article]);

  if (loading) {
    return <ArticlePageSkeleton />;
  }

  if (!article) {
    return (
      <div className="container-revista py-section">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-headline text-4xl font-bold text-revista-black mb-4">
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
    <>
      <article className="container-revista py-section">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-revista-black mb-6 md:mb-8 leading-tight">
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

      {recommendedArticles.length >= 4 && (
        <section className="py-12 border-t border-revista-separator">
          <div className="container-revista">
            <div className="mb-8">
              <div className="border-t border-b border-revista-separator py-3">
                <h2 className="font-sans text-lg lg:text-[1.35rem] uppercase tracking-[0.3em] text-revista-black font-medium text-center">
                  Citește și
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedArticles.map((rec) => (
                <a
                  key={rec.id}
                  href={`#/article/${rec.slug}`}
                  className="group block"
                >
                  <OptimizedImage
                    src={rec.image_url}
                    alt={rec.title}
                    size="medium"
                    hoverScale
                    className="w-full aspect-[3/4] mb-4"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                      {rec.category}
                    </p>
                    <h3 className="font-headline text-xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors line-clamp-3">
                      {rec.title}
                    </h3>
                    <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
                      De {rec.author}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
