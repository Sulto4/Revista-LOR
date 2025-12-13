import { Article } from './ArticleCardSmall';
import OptimizedImage from '../ui/OptimizedImage';

interface ArticleCardHeroProps {
  article: Article;
  imageHeight?: number;
}

const HERO_PLACEHOLDER_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIHN0b3AtY29sb3I9IiNmMmVmZTgiIG9mZnNldD0iMCIvPjxzdG9wIHN0b3AtY29sb3I9IiNmOGY2ZTEiIG9mZnNldD0iMTAwJSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjY3NSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==';

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
          size="hero"
          priority
          hoverScale
          hoverDuration={700}
          className="w-full h-full"
          placeholderDataUrl={HERO_PLACEHOLDER_DATA_URL}
        />
      </div>

      <div className="flex flex-col gap-2 text-center">
        <p className="text-metadata font-sans uppercase tracking-wider text-revista-gold leading-none">
          {article.category}
        </p>

        <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-revista-black group-hover:text-revista-gold transition-colors">
          {article.title}
        </h2>

        <p className="text-xs font-sans uppercase tracking-wide text-revista-text/60">
          De {article.author}
        </p>
      </div>
    </article>
  );
}
