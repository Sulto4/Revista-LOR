import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

export default function ArticlePage({ slug }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching article:', error);
      } else {
        setArticle(data);
      }
      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-revista py-section">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-revista-text/60">Se încarcă...</p>
        </div>
      </div>
    );
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
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-revista-black mb-8 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-revista-text/70 mb-8">
          <span className="font-medium text-revista-black">{article.author}</span>
          <span>•</span>
          <time dateTime={article.published_at}>{formattedDate}</time>
          <span>•</span>
          <span className="text-revista-gold">{article.category}</span>
        </div>

        <div className="border-t border-revista-text/10 mb-12"></div>

        <div className="prose prose-lg max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-revista-text leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
