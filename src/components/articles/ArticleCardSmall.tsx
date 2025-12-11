export interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  slug?: string;
}

interface ArticleCardSmallProps {
  article: Article;
}

export default function ArticleCardSmall({ article }: ArticleCardSmallProps) {
  return (
    <article className="group cursor-pointer">
      <div className="overflow-hidden mb-1">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-metadata font-sans uppercase tracking-wider text-revista-gold leading-none">
          {article.category}
        </p>

        <h3 className="font-serif text-2xl font-medium text-revista-black leading-tight group-hover:text-revista-gold transition-colors">
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
