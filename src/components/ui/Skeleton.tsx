interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gradient-to-r from-revista-separator via-revista-ivory to-revista-separator bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  );
}

export function HeroSkeleton() {
  return (
    <section className="py-section">
      <div className="container-revista">
        <div className="flex flex-col gap-6">
          <div className="block lg:hidden">
            <Skeleton className="w-full aspect-[4/5] mb-4" />
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex flex-col gap-6 lg:hidden">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-24 h-24 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden space-y-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="py-4 border-b border-revista-separator">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-12 gap-x-12 gap-y-6 items-start">
            <div className="col-span-3 flex flex-col gap-6">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="w-full aspect-[4/3] mb-3" />
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </div>

            <div className="col-span-6">
              <Skeleton className="w-full aspect-[4/5] mb-4" />
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="col-span-3 flex flex-col">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="py-3 border-b border-revista-separator last:border-b-0">
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryCarouselSkeleton() {
  return (
    <section className="py-section">
      <div className="container-revista">
        <div className="mb-8 md:mb-12">
          <div className="border-t border-revista-separator pt-6 mb-6 md:mb-8">
            <div className="flex items-center justify-center">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-[3/4] mb-4" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryPageSkeletonProps {
  category: string;
  description: string;
}

export function CategoryPageSkeleton({ category, description }: CategoryPageSkeletonProps) {
  return (
    <div className="container-revista py-section">
      <div className="max-w-3xl mb-12">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-revista-black mb-6">
          {category}
        </h1>
        <p className="text-lg text-revista-text/80 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-16">
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-square md:aspect-[3/4] mb-4" />
              <div className="space-y-3 text-center">
                <Skeleton className="h-3 w-16 mx-auto" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <Skeleton className="w-full aspect-[4/5] lg:min-h-[600px]" />
          <div className="space-y-3 text-center mt-4 lg:hidden">
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8 order-3">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-square md:aspect-[3/4] mb-4" />
              <div className="space-y-3 text-center">
                <Skeleton className="h-3 w-16 mx-auto" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArticlePageSkeleton() {
  return (
    <article className="container-revista py-section">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-12 md:h-14 w-full mb-3" />
        <Skeleton className="h-12 md:h-14 w-3/4 mb-8" />

        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="border-t border-revista-text/10 mb-8" />

        <Skeleton className="w-full aspect-[16/9] mb-12" />

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
