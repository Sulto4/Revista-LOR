import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import OptimizedImage from '../ui/OptimizedImage';
import { getPlaceholderDataUrl } from '../../utils/imagePlaceholder';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
  placeholderDataUrl?: string;
}

interface CacheEntry {
  data: Article[];
  timestamp: number;
}

interface CategoryCarouselProps {
  category: string;
  title?: string;
}

const CACHE_TTL = 5 * 60 * 1000;
const ARTICLES_LIMIT = 8;

function getSafeCacheKey(category: string): string {
  const safeKey = category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `revista_cache_carousel_${safeKey}`;
}

function getCachedArticles(category: string): Article[] | null {
  try {
    const key = getSafeCacheKey(category);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data.map(normalizeArticle);
  } catch {
    return null;
  }
}

function setCachedArticles(category: string, data: Article[]): void {
  try {
    const key = getSafeCacheKey(category);
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore storage errors
  }
}

function normalizeArticle(article: Article): Article {
  return {
    ...article,
    placeholderDataUrl: article.placeholderDataUrl || getPlaceholderDataUrl(article.image_url),
  };
}

export default function CategoryCarousel({ category, title }: CategoryCarouselProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const articlesPerPage = 4;

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { rootMargin: '600px', threshold: 0 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isInView]);

  const fetchArticles = useCallback(async () => {
    if (hasFetched) return;

    const cached = getCachedArticles(category);
    if (cached) {
      setArticles(cached.map(normalizeArticle));
      setHasFetched(true);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, category, author, image_url, published_at')
      .eq('category', category)
      .order('published_at', { ascending: false })
      .limit(ARTICLES_LIMIT);

    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      const articles = (data || []).map(normalizeArticle);
      setArticles(articles);
      setCachedArticles(category, articles);
    }
    setLoading(false);
    setHasFetched(true);
  }, [category, hasFetched]);

  useEffect(() => {
    if (isInView && !hasFetched) {
      fetchArticles();
    }
  }, [isInView, hasFetched, fetchArticles]);

  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;

    if (mobileIndex === 0 && diff > 0) {
      setDragOffset(diff * 0.3);
    } else if (mobileIndex === articles.length - 1 && diff < 0) {
      setDragOffset(diff * 0.3);
    } else {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 50;

    if (diff < -threshold && mobileIndex < articles.length - 1) {
      setMobileIndex((prev) => prev + 1);
    } else if (diff > threshold && mobileIndex > 0) {
      setMobileIndex((prev) => prev - 1);
    }

    setDragOffset(0);
  };

  if (!isInView) {
    return (
      <section ref={sectionRef} className="py-12">
        <div className="container-revista">
          <div className="mb-8">
            <div className="border-t border-b border-revista-separator py-3 mb-6">
              <div className="relative flex items-center justify-center">
                <h2 className="font-sans text-lg lg:text-[1.35rem] uppercase tracking-[0.3em] text-revista-black font-medium">
                  {title || category}
                </h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="w-full aspect-square md:aspect-[3/4] bg-revista-separator/30" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-revista-separator/30" />
                  <div className="h-6 w-full bg-revista-separator/30" />
                  <div className="h-3 w-24 bg-revista-separator/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section ref={sectionRef} className="py-12">
        <div className="container-revista">
          <div className="mb-8">
            <div className="border-t border-b border-revista-separator py-3 mb-6">
              <div className="relative flex items-center justify-center">
                <h2 className="font-sans text-lg lg:text-[1.35rem] uppercase tracking-[0.3em] text-revista-black font-medium">
                  {title || category}
                </h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="w-full aspect-square md:aspect-[3/4] bg-revista-separator/50" />
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-revista-separator/50 rounded" />
                  <div className="h-6 w-full bg-revista-separator/50 rounded" />
                  <div className="h-3 w-24 bg-revista-separator/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  const articleWidthPercent = 85;
  const gapPercent = 4;
  const mobileTranslateX = -(mobileIndex * (articleWidthPercent + gapPercent)) + dragOffset / (containerRef.current?.offsetWidth || 1) * 100;

  return (
    <section ref={sectionRef} className="py-12">
      <div className="container-revista">
        <div className="mb-8">
          <div className="border-t border-b border-revista-separator py-3 mb-6">
            <div className="relative flex items-center justify-center">
              <h2 className="font-sans text-lg lg:text-[1.35rem] uppercase tracking-[0.3em] text-revista-black font-medium">
                {title || category}
              </h2>

              {!isMobile && totalPages > 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-revista-separator/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Pagina anterioara"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-sans text-sm text-revista-text/70 min-w-[3rem] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-revista-separator/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Pagina urmatoare"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobile ? (
          <div
            ref={containerRef}
            className="overflow-hidden -mx-4 px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${mobileTranslateX}%)`,
                gap: `${gapPercent}%`,
                transitionDuration: isDragging.current ? '0ms' : '300ms'
              }}
            >
              {articles.map((article) => (
                <a
                  key={article.id}
                  href={`#/article/${article.slug}`}
                  className="block flex-shrink-0"
                  style={{ width: `${articleWidthPercent}%` }}
                >
                  <OptimizedImage
                    src={article.image_url}
                    alt={article.title}
                    size="medium"
                    placeholderDataUrl={article.placeholderDataUrl}
                    className="w-full aspect-[3/4] mb-4"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                      {article.category}
                    </p>
                    <h3 className="font-headline text-xl font-medium text-revista-black leading-tight line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
                      De {article.author}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {articles.length > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-6">
                {articles.map((_, index) => (
                  <span
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      index === mobileIndex
                        ? 'bg-revista-gold'
                        : 'bg-revista-separator'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentArticles.map((article) => (
              <a
                key={article.id}
                href={`#/article/${article.slug}`}
                className="group block"
              >
                <OptimizedImage
                  src={article.image_url}
                  alt={article.title}
                  size="medium"
                  placeholderDataUrl={article.placeholderDataUrl}
                  hoverScale
                  className="w-full aspect-square md:aspect-[3/4] mb-4"
                />
                <div className="space-y-2">
                  <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                    {article.category}
                  </p>
                  <h3 className="font-headline text-xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
                    De {article.author}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
