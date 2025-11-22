'use client';

import { useState } from 'react';

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
  // Don't render if no valid src
  if (!src || src.trim() === '' || src === 'null' || src === 'undefined') {
    return null;
  }

  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder SVG
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  const handleError = () => {
    // Only show fallback if image actually fails to load
    // Don't show fallback for valid API images
    if (!hasError && imgSrc !== fallbackSrc && imgSrc && imgSrc.trim() !== '') {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Use regular img tag for better error handling and compatibility
  if (fill) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

