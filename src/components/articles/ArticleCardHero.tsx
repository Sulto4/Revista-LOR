import { Article } from './ArticleCardSmall';

interface ArticleCardHeroProps {
  article: Article;
  imageHeight?: number;
}

export default function ArticleCardHero({ article, imageHeight }: ArticleCardHeroProps) {
  return (
    <article className="group cursor-pointer">
      <div
        className="overflow-hidden mb-4 aspect-[4/5] lg:aspect-auto"
        style={imageHeight ? { height: imageHeight } : undefined}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-2 text-center">
        <p className="text-metadata font-sans uppercase tracking-wider text-revista-gold leading-none">
          {article.category}
        </p>

        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-revista-black group-hover:text-revista-gold transition-colors">
          {article.title}
        </h2>

        <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
          De {article.author}
        </p>
      </div>
    </article>
  );
}
