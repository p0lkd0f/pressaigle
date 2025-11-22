'use client';

import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

// Check if URL is external (needs proxy)
function isExternalUrl(url: string): boolean {
  if (!url || url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return false;
  }
  try {
    if (typeof window !== 'undefined') {
      const urlObj = new URL(url);
      return urlObj.origin !== window.location.origin;
    }
  } catch {
    return false;
  }
  return false;
}

// Get proxied URL for external images
function getImageUrl(url: string, uniqueKey?: string): string {
  if (typeof window === 'undefined') {
    return url; // Server-side, return as-is
  }
  if (isExternalUrl(url)) {
    // Use our simple proxy API with unique key to prevent caching issues
    const cacheKey = uniqueKey || Math.random().toString(36).substring(7);
    return `/api/image?url=${encodeURIComponent(url)}&key=${cacheKey}`;
  }
  return url;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fill = false,
  priority = false,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || '');

  // Update imgSrc when src prop changes - use src as unique key
  useEffect(() => {
    if (src && src.trim() !== '' && src !== 'null' && src !== 'undefined') {
      // Use the src URL itself as part of the unique key to ensure each image is unique
      const uniqueKey = src.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
      const proxiedUrl = getImageUrl(src, uniqueKey);
      setImgSrc(proxiedUrl);
      setHasError(false);
    }
  }, [src]);

  // Don't render if no valid src
  if (!src || src.trim() === '' || src === 'null' || src === 'undefined') {
    return null;
  }

  // Fallback placeholder SVG
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Simple img tag - use proxied URL for external images to bypass CORS
  // Add key prop to force React to treat each image as unique
  if (fill) {
    return (
      <img
        key={src} // Force React to create new img element for each unique src
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <img
      key={src} // Force React to create new img element for each unique src
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

