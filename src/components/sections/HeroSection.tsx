import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import ArticleCardHero from '../articles/ArticleCardHero';
import ArticleCardCompact from '../articles/ArticleCardCompact';
import ArticleCardList from '../articles/ArticleCardList';
import { Article } from '../articles/ArticleCardSmall';
import { HeroSkeleton } from '../ui/Skeleton';

interface DBArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
}

function formatArticle(article: DBArticle): Article {
  return {
    id: article.id,
    title: article.title,
    category: article.category,
    author: article.author,
    date: new Date(article.published_at).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    imageUrl: article.image_url,
    slug: article.slug
  };
}

const HERO_LIST_LIMIT = 6;
const CACHE_KEY = 'revista_hero_articles';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedArticles {
  articles: Article[];
  isStale: boolean;
}

function getCachedArticles(): CachedArticles {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return { articles: [], isStale: false };

    const { articles, timestamp } = JSON.parse(cached);
    const isStale = Date.now() - timestamp > CACHE_DURATION;
    return { articles: articles || [], isStale };
  } catch {
    return { articles: [], isStale: false };
  }
}

function setCachedArticles(articles: Article[]) {
  try {
    const payload = {
      articles,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable
  }
}

export default function HeroSection() {
  const [initialState] = useState(() => {
    const cached = getCachedArticles();
    return {
      articles: cached.articles,
      hasCache: cached.articles.length > 0,
      isStale: cached.isStale,
    };
  });
  const [articles, setArticles] = useState<Article[]>(initialState.articles);
  const [loading, setLoading] = useState(!initialState.hasCache);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number>(0);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;

    async function fetchArticles() {
      if (!initialState.hasCache) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, category, author, image_url, published_at')
        .order('published_at', { ascending: false })
        .limit(3 + HERO_LIST_LIMIT);

      if (!isActive) return;

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        const formattedArticles = (data || []).map(formatArticle);
        setArticles(formattedArticles);
        setCachedArticles(formattedArticles);
      }
      setLoading(false);
    }

    fetchArticles();

    return () => {
      isActive = false;
    };
  }, [initialState.hasCache, initialState.isStale]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    let resizeObserver: ResizeObserver | null = null;
    let rafId: number | null = null;

    function measureLeftColumn() {
      if (leftColumnRef.current) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (leftColumnRef.current) {
            setLeftColumnHeight(leftColumnRef.current.offsetHeight);
          }
        });
      }
    }

    function setupObserver() {
      if (mediaQuery.matches && leftColumnRef.current) {
        resizeObserver = new ResizeObserver(measureLeftColumn);
        resizeObserver.observe(leftColumnRef.current);
        measureLeftColumn();
      } else {
        setLeftColumnHeight(0);
      }
    }

    function cleanupObserver() {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function handleMediaChange(e: MediaQueryListEvent) {
      cleanupObserver();
      if (e.matches) {
        setupObserver();
      } else {
        setLeftColumnHeight(0);
      }
    }

    setupObserver();
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      cleanupObserver();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [articles]);

  if (loading) {
    return <HeroSkeleton />;
  }

  if (articles.length === 0) {
    return null;
  }

  const heroArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const listArticles = articles.slice(3, 3 + HERO_LIST_LIMIT);

  return (
    <section className="pt-section pb-12">
      <div className="container-revista">
        <div className="flex flex-col gap-6">
          <a href={`#/article/${heroArticle.slug}`} className="block lg:hidden">
            <ArticleCardHero article={heroArticle} />
          </a>

          <div className="flex flex-col gap-6 lg:hidden">
            {secondaryArticles.map((article) => (
              <a
                key={article.id}
                href={`#/article/${article.slug}`}
                className="block"
              >
                <ArticleCardCompact article={article} />
              </a>
            ))}
          </div>

          <div className="lg:hidden">
            <div className="space-y-0">
              {listArticles.map((article) => (
                <ArticleCardList key={article.id} article={article} />
              ))}
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-12 gap-x-12 gap-y-6 items-start">
            <div ref={leftColumnRef} className="col-span-3 flex flex-col gap-6">
              {secondaryArticles.map((article) => (
                <a
                  key={article.id}
                  href={`#/article/${article.slug}`}
                  className="block"
                >
                  <ArticleCardCompact article={article} />
                </a>
              ))}
            </div>

            <div className="col-span-6">
              <a href={`#/article/${heroArticle.slug}`} className="block">
                <ArticleCardHero article={heroArticle} imageHeight={leftColumnHeight || undefined} />
              </a>
            </div>

            <div className="col-span-3 self-stretch flex flex-col">
              <div className="flex-1 flex flex-col justify-start">
                {listArticles.map((article) => (
                  <ArticleCardList key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
