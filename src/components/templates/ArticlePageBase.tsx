import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from '../ui/Link';
import ArticleCardSmall, { Article } from '../articles/ArticleCardSmall';
import OptimizedImage from '../ui/OptimizedImage';

interface ArticlePageBaseProps {
  category: string;
  title: string;
  author: string;
  date: string;
  heroImage: string;
  children: ReactNode;
  recommendedArticles?: Article[];
}

export default function ArticlePageBase({
  category,
  title,
  author,
  date,
  heroImage,
  children,
  recommendedArticles = [],
}: ArticlePageBaseProps) {
  return (
    <article>
      <div className="bg-revista-ivory py-6">
        <div className="container-revista">
          <nav className="flex items-center gap-2 text-sm text-revista-text/70">
            <Link variant="inline" href="#/" className="hover:text-revista-gold no-underline">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link
              variant="inline"
              href={`#/${category.toLowerCase()}`}
              className="hover:text-revista-gold no-underline"
            >
              {category}
            </Link>
            <ChevronRight size={16} />
            <span className="text-revista-text">Articol</span>
          </nav>
        </div>
      </div>

      <div className="container-revista py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-metadata font-sans uppercase tracking-wider text-revista-gold mb-6">
            {category}
          </p>

          <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold text-revista-black leading-tight mb-8">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-metadata text-revista-text/70 mb-12">
            <span className="font-medium text-revista-text">De {author}</span>
            <span>•</span>
            <span>{date}</span>
          </div>

          <OptimizedImage
            src={heroImage}
            alt={title}
            size="hero"
            priority
            className="w-full aspect-[16/9] mb-12"
          />

          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      </div>

      {recommendedArticles.length > 0 && (
        <div className="bg-white py-section">
          <div className="container-revista">
            <h2 className="font-headline text-4xl font-semibold text-revista-black mb-12">
              Articole recomandate
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-card">
              {recommendedArticles.map((article) => (
                <ArticleCardSmall key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
