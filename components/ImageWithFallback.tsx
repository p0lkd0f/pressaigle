'use client';

import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
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
      setImgSrc(src);
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

  // Use regular img tag with CORS-friendly attributes for direct fetching
  // crossOrigin="anonymous" allows CORS requests
  // referrerPolicy="no-referrer" prevents referrer from being sent (may help with some restrictions)
  if (fill) {
    return (
      <img
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <img
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}

