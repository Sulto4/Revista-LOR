import { useState, useRef, useEffect } from 'react';

type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'hero';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: ImageSize;
  priority?: boolean;
  hoverScale?: boolean;
  hoverDuration?: 500 | 700;
}

const SIZE_CONFIG: Record<ImageSize, { width: number; quality: number }> = {
  thumbnail: { width: 200, quality: 70 },
  small: { width: 400, quality: 75 },
  medium: { width: 800, quality: 80 },
  large: { width: 1200, quality: 85 },
  hero: { width: 1600, quality: 90 },
};

function optimizeImageUrl(url: string, size: ImageSize): string {
  const config = SIZE_CONFIG[size];

  if (url.includes('pexels.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=compress&cs=tinysrgb&w=${config.width}&q=${config.quality}`;
  }

  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${config.width}&q=${config.quality}&auto=format`;
  }

  return url;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  size = 'medium',
  priority = false,
  hoverScale = false,
  hoverDuration = 500,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const optimizedSrc = optimizeImageUrl(src, size);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-r from-revista-separator via-revista-ivory to-revista-separator bg-[length:200%_100%] transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100 animate-shimmer'
        }`}
      />

      {isInView && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all ${
            hoverDuration === 700 ? 'duration-700' : 'duration-500'
          } ${hoverScale ? 'group-hover:scale-105' : ''} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 bg-revista-separator flex items-center justify-center">
          <span className="text-revista-text/40 text-sm">Imagine indisponibila</span>
        </div>
      )}
    </div>
  );
}
