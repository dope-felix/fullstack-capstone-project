import React from 'react';
import optimizedImages from '../generated/gift-images.json';

export default function GiftImage({ src, alt, className, sizes, loading = 'lazy' }) {
  const optimized = optimizedImages[src];

  return (
    <picture>
      {optimized && (
        <source type="image/webp" srcSet={optimized.srcSet} sizes={sizes} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        width={optimized?.width}
        height={optimized?.height}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}
