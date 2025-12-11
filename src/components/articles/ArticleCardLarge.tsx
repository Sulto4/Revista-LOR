import { Article } from './ArticleCardSmall';

interface ArticleCardLargeProps {
  article: Article;
}

export default function ArticleCardLarge({ article }: ArticleCardLargeProps) {
  return (
    <article className="group cursor-pointer relative overflow-hidden">
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px]">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-revista-black/80 via-revista-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 text-revista-white flex flex-col gap-1">
          <p className="text-metadata font-sans uppercase tracking-wider text-revista-gold leading-none">
            {article.category}
          </p>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight group-hover:text-revista-gold transition-colors">
            {article.title}
          </h2>

          <div className="flex items-center gap-3 text-metadata text-revista-white/90">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
