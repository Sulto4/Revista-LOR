import { Article } from './ArticleCardSmall';
import OptimizedImage from '../ui/OptimizedImage';

interface ArticleCardMediumProps {
  article: Article;
}

export default function ArticleCardMedium({ article }: ArticleCardMediumProps) {
  return (
    <article className="group cursor-pointer">
      <OptimizedImage
        src={article.imageUrl}
        alt={article.title}
        size="medium"
        hoverScale
        className="w-full aspect-[3/4] mb-1"
      />

      <div className="flex flex-col gap-1">
        <p className="text-metadata font-sans uppercase tracking-wider text-revista-gold leading-none">
          {article.category}
        </p>

        <h3 className="font-serif text-3xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors">
          {article.title}
        </h3>

        <div className="flex items-center gap-2 text-metadata text-revista-text/70">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
        </div>
      </div>
    </article>
  );
}
