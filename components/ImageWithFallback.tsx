'use client';

import { useState, useEffect, useMemo } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  uniqueId?: string; // Add unique ID prop to force uniqueness
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

// Get proxied URL for external images with cache busting
function getImageUrl(url: string, uniqueId?: string): string {
  if (typeof window === 'undefined') {
    return url; // Server-side, return as-is
  }
  if (isExternalUrl(url)) {
    // Create a unique hash from the URL to ensure each unique URL gets a unique proxy path
    // This prevents browser from caching the same image for different URLs
    let urlHash = '';
    try {
      // Create a hash from the full URL
      let hash = 0;
      const str = url + (uniqueId || '');
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      urlHash = Math.abs(hash).toString(36).substring(0, 12);
    } catch {
      // Fallback: use URL substring
      urlHash = (url + (uniqueId || '')).substring(0, 50).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    }
    // Add timestamp to prevent browser caching
    const timestamp = Date.now().toString(36);
    return `/api/image?url=${encodeURIComponent(url)}&id=${urlHash}&t=${timestamp}`;
  }
  return url;
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fill = false,
  priority = false,
  uniqueId,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  
  // Memoize the proxied URL to ensure it's stable for each unique src
  const proxiedUrl = useMemo(() => {
    if (src && src.trim() !== '' && src !== 'null' && src !== 'undefined') {
      return getImageUrl(src, uniqueId);
    }
    return '';
  }, [src, uniqueId]);

  // Update imgSrc when proxiedUrl changes
  useEffect(() => {
    if (proxiedUrl) {
      setImgSrc(proxiedUrl);
      setHasError(false);
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Image] Loading: ${src.substring(0, 60)}... → ${proxiedUrl.substring(0, 60)}...`);
      }
    } else {
      setImgSrc('');
    }
  }, [proxiedUrl, src]);

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
  // Use a combination of src and uniqueId as key to force React to create new element for each unique image
  const imageKey = `${src}-${uniqueId || ''}`;
  
  if (fill) {
    return (
      <img
        key={imageKey}
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  return (
    <img
      key={imageKey}
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

