import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import OptimizedImage from '../components/ui/OptimizedImage';

interface CategoryPageProps {
  category: string;
  description: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
}

export default function CategoryPage({ category, description }: CategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
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

  if (loading) {
    return (
      <div className="container-revista py-section">
        <div className="max-w-3xl mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-revista-black mb-6">
            {category}
          </h1>
          <p className="text-lg text-revista-text/80 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="text-center text-revista-text/60">
          Se încarcă articolele...
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="container-revista py-section">
        <div className="max-w-3xl mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-revista-black mb-6">
            {category}
          </h1>
          <p className="text-lg text-revista-text/80 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="text-center text-revista-text/60">
          Nu există articole în această categorie.
        </div>
      </div>
    );
  }

  const heroArticle = articles[0];
  const leftArticles = articles.slice(1, 3);
  const rightArticles = articles.slice(3, 5);
  const remainingArticles = articles.slice(5);

  return (
    <>
      <div className="container-revista py-section">
        <div className="max-w-3xl mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-revista-black mb-6">
            {category}
          </h1>
          <p className="text-lg text-revista-text/80 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-16">
          <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            {leftArticles.map((article) => (
              <a
                key={article.id}
                href={`#/article/${article.slug}`}
                className="group cursor-pointer block"
              >
                <OptimizedImage
                  src={article.image_url}
                  alt={article.title}
                  size="small"
                  hoverScale
                  className="w-full aspect-square md:aspect-[3/4] mb-4"
                />
                <div className="space-y-3 text-center">
                  <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                    {category}
                  </p>
                  <h3 className="font-serif text-xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
                    De {article.author}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <a
              href={`#/article/${heroArticle.slug}`}
              className="group cursor-pointer block lg:h-full"
            >
              <OptimizedImage
                src={heroArticle.image_url}
                alt={heroArticle.title}
                size="large"
                priority
                hoverScale
                hoverDuration={700}
                className="w-full aspect-[4/5] lg:h-full lg:aspect-auto lg:min-h-full"
              />
              <div className="space-y-3 text-center mt-4 lg:hidden">
                <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                  {category}
                </p>
                <h3 className="font-serif text-2xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors">
                  {heroArticle.title}
                </h3>
                <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
                  De {heroArticle.author}
                </p>
              </div>
            </a>
          </div>

          <div className="lg:col-span-3 space-y-8 order-3">
            {rightArticles.map((article) => (
              <a
                key={article.id}
                href={`#/article/${article.slug}`}
                className="group cursor-pointer block"
              >
                <OptimizedImage
                  src={article.image_url}
                  alt={article.title}
                  size="small"
                  hoverScale
                  className="w-full aspect-square md:aspect-[3/4] mb-4"
                />
                <div className="space-y-3 text-center">
                  <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                    {category}
                  </p>
                  <h3 className="font-serif text-xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors">
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
      </div>

      {remainingArticles.length > 0 && (
        <div className="bg-revista-ivory py-section">
          <div className="container-revista">
            <div className="border-t border-revista-separator pt-6 mb-12">
              <h2 className="font-sans text-lg uppercase tracking-[0.3em] text-revista-black font-medium text-center">
                Mai multe articole din {category}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {remainingArticles.map((article) => (
                <a
                  key={article.id}
                  href={`#/article/${article.slug}`}
                  className="group cursor-pointer block"
                >
                  <OptimizedImage
                    src={article.image_url}
                    alt={article.title}
                    size="medium"
                    hoverScale
                    className="w-full aspect-square md:aspect-[4/5] mb-4"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-sans uppercase tracking-wider text-revista-gold">
                      {category}
                    </p>
                    <h3 className="font-serif text-lg font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors line-clamp-3">
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
        </div>
      )}
    </>
  );
}
