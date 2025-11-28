import React from 'react';
import Image from 'next/image';
import { ImageSkeleton } from './skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  fill = false,
  sizes,
  style,
}: OptimizedImageProps) {
  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = blurDataURL || `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#374151"/>
      <rect width="100%" height="100%" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4B5563;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6B7280;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`
  ).toString('base64')}`;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        sizes={sizes}
        style={style}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={defaultBlurDataURL}
      sizes={sizes}
      style={style}
    />
  );
}

// Icon component for small images/icons
export function OptimizedIcon({
  src,
  alt,
  width = 24,
  height = 24,
  className = '',
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  // Remove placeholder for small images to improve performance
  const shouldUsePlaceholder = width >= 40 && height >= 40;
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={90}
      placeholder={shouldUsePlaceholder ? 'blur' : 'empty'}
    />
  );
}

// Logo component for brand images
export function OptimizedLogo({
  src,
  alt,
  width = 120,
  height = 40,
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={85}
      placeholder="blur"
    />
  );
}