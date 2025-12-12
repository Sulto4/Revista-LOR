import { Suspense, ReactNode } from 'react';
import {
  ArticlePageSkeleton,
  CategoryPageSkeleton,
  StaticPageSkeleton,
  ContactPageSkeleton,
  RedactiePageSkeleton,
} from './Skeleton';

interface SmartSuspenseProps {
  path: string;
  children: ReactNode;
}

const categoryDescriptions: Record<string, { category: string; description: string }> = {
  '/stiri': {
    category: 'Stiri',
    description: 'Ultimele noutati din Romania si din lume.',
  },
  '/lifestyle': {
    category: 'Lifestyle',
    description: 'Descopera cele mai noi tendinte.',
  },
  '/cultura': {
    category: 'Cultura',
    description: 'Arta, muzica si evenimente culturale.',
  },
  '/fashion': {
    category: 'Fashion',
    description: 'Tendinte si stil in moda.',
  },
  '/beauty': {
    category: 'Beauty',
    description: 'Sfaturi de frumusete si ingrijire.',
  },
  '/tech': {
    category: 'Tech',
    description: 'Inovatii si tehnologie.',
  },
  '/sanatate': {
    category: 'Sanatate',
    description: 'Sfaturi pentru o viata sanatoasa.',
  },
  '/sport': {
    category: 'Sport',
    description: 'Stiri si evenimente sportive.',
  },
  '/horoscop': {
    category: 'Horoscop',
    description: 'Descopera ce iti rezerva astrele.',
  },
};

function getSkeleton(path: string) {
  if (path.startsWith('/article/')) {
    return <ArticlePageSkeleton />;
  }

  if (categoryDescriptions[path]) {
    const { category, description } = categoryDescriptions[path];
    return <CategoryPageSkeleton category={category} description={description} />;
  }

  switch (path) {
    case '/contact':
      return <ContactPageSkeleton />;
    case '/redactie':
      return <RedactiePageSkeleton />;
    case '/terms':
    case '/privacy':
      return <StaticPageSkeleton />;
    default:
      return <StaticPageSkeleton />;
  }
}

export default function SmartSuspense({ path, children }: SmartSuspenseProps) {
  return <Suspense fallback={getSkeleton(path)}>{children}</Suspense>;
}
