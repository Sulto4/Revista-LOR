import { Article } from './ArticleCardSmall';

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
        <h3 className="font-serif text-base font-medium text-revista-black leading-snug group-hover:text-revista-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
          De {article.author}
        </p>
      </div>
      <div className="flex-shrink-0 w-20 h-20 overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
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
