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
  sizes?: string;
  width?: number;
  height?: number;
  placeholderDataUrl?: string;
}

const SIZE_CONFIG: Record<ImageSize, { width: number; quality: number }> = {
  thumbnail: { width: 200, quality: 70 },
  small: { width: 400, quality: 75 },
  medium: { width: 800, quality: 80 },
  large: { width: 1200, quality: 85 },
  hero: { width: 1400, quality: 82 },
};

const SRCSET_WIDTHS = [360, 480, 640, 768, 1024, 1200];

function getBaseUrl(url: string): string {
  if (url.includes('?')) {
    return url.split('?')[0];
  }
  return url;
}

function optimizeImageUrl(url: string, width: number, quality: number): string {
  if (url.includes('pexels.com')) {
    const baseUrl = getBaseUrl(url);
    return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}&q=${quality}&fm=webp`;
  }

  if (url.includes('unsplash.com')) {
    const baseUrl = getBaseUrl(url);
    return `${baseUrl}?w=${width}&q=${quality}&auto=format`;
  }

  return url;
}

function generateSrcSet(url: string, quality: number): string {
  if (!url.includes('pexels.com') && !url.includes('unsplash.com')) {
    return '';
  }

  return SRCSET_WIDTHS
    .map((w) => `${optimizeImageUrl(url, w, quality)} ${w}w`)
    .join(', ');
}

function getDefaultSizes(priority: boolean): string {
  if (priority) {
    return '(min-width: 1024px) 50vw, 100vw';
  }
  return '(max-width: 768px) 100vw, 33vw';
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  size = 'medium',
  priority = false,
  hoverScale = false,
  hoverDuration = 500,
  sizes,
  width,
  height,
  placeholderDataUrl,
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

  const config = SIZE_CONFIG[size];
  const optimizedSrc = optimizeImageUrl(src, config.width, config.quality);
  const srcSet = generateSrcSet(src, config.quality);
  const imageSizes = sizes || getDefaultSizes(priority);

  const shouldShowPlaceholder = Boolean(placeholderDataUrl && !isLoaded && !hasError);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {placeholderDataUrl && (
        <img
          src={placeholderDataUrl}
          aria-hidden
          alt=""
          className={`absolute inset-0 h-full w-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
            shouldShowPlaceholder ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-r from-revista-separator via-revista-ivory to-revista-separator bg-[length:200%_100%] transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100 animate-shimmer'
        }`}
      />

      {isInView && !hasError && (
        <img
          src={optimizedSrc}
          srcSet={srcSet || undefined}
          sizes={srcSet ? imageSizes : undefined}
          alt={alt}
          width={width}
          height={height}
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
