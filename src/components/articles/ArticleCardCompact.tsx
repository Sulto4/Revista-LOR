import { Article } from './ArticleCardSmall';

interface ArticleCardCompactProps {
  article: Article;
}

export default function ArticleCardCompact({ article }: ArticleCardCompactProps) {
  return (
    <article className="group cursor-pointer h-full flex flex-col">
      <div className="overflow-hidden mb-4 aspect-[5/6]">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-2 text-center shrink-0">
        <p className="text-xs font-sans uppercase tracking-wider text-revista-gold leading-none">
          {article.category}
        </p>

        <h3 className="font-serif text-base lg:text-lg font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
          De {article.author}
        </p>
      </div>
    </article>
  );
}
