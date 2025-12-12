import { Article } from './ArticleCardSmall';
import OptimizedImage from '../ui/OptimizedImage';

interface ArticleCardListProps {
  article: Article & { slug?: string };
}

export default function ArticleCardList({ article }: ArticleCardListProps) {
  const content = (
    <>
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-xs font-sans uppercase tracking-wider text-revista-gold leading-none">
          {article.category}
        </p>
        <h3 className="font-headline text-base font-medium text-revista-black leading-snug group-hover:text-revista-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
          De {article.author}
        </p>
      </div>
      <OptimizedImage
        src={article.imageUrl}
        alt={article.title}
        size="thumbnail"
        hoverScale
        className="flex-shrink-0 w-20 h-20"
      />
    </>
  );

  if (article.slug) {
    return (
      <a
        href={`#/article/${article.slug}`}
        className="group cursor-pointer flex gap-4 py-4 border-b border-revista-separator last:border-b-0 hover:no-underline"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="group cursor-pointer flex gap-4 py-4 border-b border-revista-separator last:border-b-0">
      {content}
    </article>
  );
}
