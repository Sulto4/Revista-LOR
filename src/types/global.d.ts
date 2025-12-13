import type { Article } from '../components/articles/ArticleCardSmall';

declare global {
  interface Window {
    __REVISTA_HERO_PREFETCH__?: {
      articles: Article[];
      timestamp: number;
    };
  }
}

export {};
