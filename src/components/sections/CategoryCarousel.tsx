import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import OptimizedImage from '../ui/OptimizedImage';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
}

interface CategoryCarouselProps {
  category: string;
  title?: string;
}

export default function CategoryCarousel({ category, title }: CategoryCarouselProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const articlesPerPage = 4;

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
    async function fetchArticles() {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    }

    fetchArticles();
  }, [category]);

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

  if (loading) {
    return (
      <section className="py-12 md:py-section">
        <div className="container-revista">
          <div className="text-center text-revista-text/60">Se incarca...</div>
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
    <section className="py-12 md:py-section">
      <div className="container-revista">
        <div className="mb-8 md:mb-12">
          <div className="border-t-0 md:border-t border-revista-separator pt-0 md:pt-6 mb-6 md:mb-8">
            <div className="relative flex items-center justify-between md:justify-center">
              <h2 className="font-sans text-lg lg:text-[1.35rem] uppercase tracking-[0.3em] text-revista-black font-medium">
                {title || category}
              </h2>

              {isMobile && articles.length > 1 && (
                <div className="flex items-center gap-1.5">
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

              {!isMobile && totalPages > 1 && (
                <div className="absolute right-0 top-0 flex items-center gap-4">
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
                    className="w-full aspect-[3/4] mb-4"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                      {article.category}
                    </p>
                    <h3 className="font-serif text-xl font-medium text-revista-black leading-tight line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
                      De {article.author}
                    </p>
                  </div>
                </a>
              ))}
            </div>
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
                  hoverScale
                  className="w-full aspect-square md:aspect-[3/4] mb-4"
                />
                <div className="space-y-2">
                  <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                    {article.category}
                  </p>
                  <h3 className="font-serif text-xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors line-clamp-3">
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
