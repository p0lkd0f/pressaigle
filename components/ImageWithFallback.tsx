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
function getImageUrl(url: string): string {
  if (typeof window === 'undefined') {
    return url; // Server-side, return as-is
  }
  if (isExternalUrl(url)) {
    // Use our simple proxy API
    // Create a hash from the URL to ensure each unique URL gets a unique proxy path
    // This prevents browser from caching the same image for different URLs
    let urlHash = '';
    try {
      // Create a simple hash from the URL
      for (let i = 0; i < url.length && i < 50; i++) {
        const char = url.charCodeAt(i);
        urlHash += char.toString(36);
      }
      urlHash = urlHash.substring(0, 30);
    } catch {
      // Fallback: use URL substring
      urlHash = url.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
    }
    return `/api/image?url=${encodeURIComponent(url)}&id=${urlHash}`;
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

  // Update imgSrc when src prop changes
  useEffect(() => {
    if (src && src.trim() !== '' && src !== 'null' && src !== 'undefined') {
      const proxiedUrl = getImageUrl(src);
      setImgSrc(proxiedUrl);
      setHasError(false);
    } else {
      setImgSrc('');
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

