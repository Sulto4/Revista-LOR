import { Article } from './ArticleCardSmall';
import OptimizedImage from '../ui/OptimizedImage';

interface ArticleCardHeroProps {
  article: Article;
  imageHeight?: number;
}

export default function ArticleCardHero({ article, imageHeight }: ArticleCardHeroProps) {
  return (
    <article className="group cursor-pointer">
      <div
        className="mb-4 aspect-[4/5] lg:aspect-auto"
        style={imageHeight ? { height: imageHeight } : undefined}
      >
        <OptimizedImage
          src={article.imageUrl}
          alt={article.title}
          size="large"
          priority
          hoverScale
          hoverDuration={700}
          className="w-full h-full"
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
