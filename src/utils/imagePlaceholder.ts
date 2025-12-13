const LOW_RES_WIDTH = 32;
const LOW_RES_QUALITY = 12;
const BLUR_AMOUNT = 40;

function getBaseUrl(url: string): string {
  if (url.includes('?')) {
    return url.split('?')[0];
  }
  return url;
}

function buildPlaceholder(url: string): string | undefined {
  if (!url) return undefined;

  const baseUrl = getBaseUrl(url);

  if (url.includes('pexels.com')) {
    return `${baseUrl}?auto=compress&cs=tinysrgb&w=${LOW_RES_WIDTH}&q=${LOW_RES_QUALITY}&blur=${BLUR_AMOUNT}&fm=webp`;
  }

  if (url.includes('unsplash.com')) {
    return `${baseUrl}?w=${LOW_RES_WIDTH}&q=${LOW_RES_QUALITY}&auto=format&blur=${BLUR_AMOUNT}`;
  }

  return undefined;
}

export function getPlaceholderDataUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return buildPlaceholder(url);
}
