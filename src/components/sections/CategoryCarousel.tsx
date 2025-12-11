import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const articlesPerPage = 4;

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

  if (loading) {
    return (
      <section className="py-section">
        <div className="container-revista">
          <div className="text-center text-revista-text/60">Se încarcă...</div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-section">
      <div className="container-revista">
        <div className="mb-12">
          <div className="border-t border-revista-separator pt-6 mb-8">
            <div className="relative">
              <h2 className="font-sans text-lg uppercase tracking-[0.3em] text-revista-black font-medium text-center">
                {title || category}
              </h2>
              {totalPages > 1 && (
                <div className="absolute right-0 top-0 flex items-center gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-revista-separator/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Pagina anterioară"
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
                    aria-label="Pagina următoare"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
}
