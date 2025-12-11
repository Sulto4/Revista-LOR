import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ArticleCardHero from '../articles/ArticleCardHero';
import ArticleCardCompact from '../articles/ArticleCardCompact';
import ArticleCardList from '../articles/ArticleCardList';
import { Article } from '../articles/ArticleCardSmall';

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

export default function HeroSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number>(0);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3 + HERO_LIST_LIMIT);

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        const formattedArticles = (data || []).map(formatArticle);
        setArticles(formattedArticles);
      }
      setLoading(false);
    }

    fetchArticles();
  }, []);

  useLayoutEffect(() => {
    function measureLeftColumn() {
      if (leftColumnRef.current) {
        setLeftColumnHeight(leftColumnRef.current.offsetHeight);
      }
    }

    measureLeftColumn();
    window.addEventListener('resize', measureLeftColumn);
    return () => window.removeEventListener('resize', measureLeftColumn);
  }, [articles]);

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

  const heroArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const listArticles = articles.slice(3, 3 + HERO_LIST_LIMIT);

  return (
    <section className="py-section">
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
