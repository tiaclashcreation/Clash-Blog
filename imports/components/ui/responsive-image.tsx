import React, { useState, useEffect } from 'react';
import { getDeviceInfo } from '@/utils/device-utils';

export interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  fallbackSrc?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loadingPriority?: 'high' | 'medium' | 'low';
  placeholder?: string;
  blur?: boolean;
  aspectRatio?: string | number;
  aboveTheFold?: boolean;
}

const generateSrcSet = (src: string): string => {
  if (!src) return '';
  
  // Don't generate srcset for external URLs
  if (src.startsWith('http') && !src.includes(window.location.host)) {
    return src;
  }
  
  // Don't generate srcset for SVGs
  if (src.endsWith('.svg')) {
    return src;
  }
  
  // Parse the URL to extract the path and extension
  const [path, extension] = src.split(/\.(?=[^.]+$)/);
  
  // Handle WebP images
  if (extension === 'webp') {
    return `
      ${path}@1x.webp 1x,
      ${path}@2x.webp 2x,
      ${path}@3x.webp 3x
    `;
  }
  
  // Return the original source if we can't generate a srcset
  return src;
};

/**
 * ResponsiveImage component for optimized image loading
 * - Automatically selects the appropriate image based on device
 * - Supports WebP with fallback
 * - Uses native lazy loading with priority option
 * - Handles loading states and animations
 */
export const ResponsiveImage = ({
  src,
  alt,
  sizes = '100vw',
  mobileSrc,
  tabletSrc,
  desktopSrc,
  fallbackSrc,
  className = '',
  width,
  height,
  loadingPriority = 'medium',
  placeholder,
  blur = false,
  aspectRatio,
  aboveTheFold = false,
  ...props
}: ResponsiveImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [deviceBasedSrc, setDeviceBasedSrc] = useState(src);
  const [error, setError] = useState(false);
  
  // Set loading attribute based on priority and position
  const getLoadingAttribute = (): 'eager' | 'lazy' => {
    if (aboveTheFold || loadingPriority === 'high') {
      return 'eager';
    }
    return 'lazy';
  };

  // Select appropriate image based on device
  useEffect(() => {
    const deviceInfo = getDeviceInfo();
    let newSrc = src;
    
    // Select appropriate image based on device type
    if (deviceInfo.isMobile && mobileSrc) {
      newSrc = mobileSrc;
    } else if (deviceInfo.isTablet && tabletSrc) {
      newSrc = tabletSrc;
    } else if (deviceInfo.isDesktop && desktopSrc) {
      newSrc = desktopSrc;
    }
    
    setDeviceBasedSrc(newSrc);
  }, [src, mobileSrc, tabletSrc, desktopSrc]);

  // Handle image load event
  const handleLoad = () => {
    setLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    setError(true);
    if (fallbackSrc) {
      setDeviceBasedSrc(fallbackSrc);
    }
  };

  // Generate CSS styles for aspect ratio
  const imageStyles: React.CSSProperties = {
    ...props.style,
  };
  
  if (aspectRatio) {
    imageStyles.aspectRatio = aspectRatio.toString();
    imageStyles.objectFit = 'cover';
  }
  
  // Add transition for blur effect
  if (blur) {
    imageStyles.filter = loaded ? 'none' : 'blur(10px)';
    imageStyles.transition = 'filter 0.3s ease-out';
  }

  // Define loading animation class
  const loadingClass = loaded ? '' : ' opacity-0';
  const hasError = error && !fallbackSrc;

  return (
    <div className={`relative overflow-hidden ${className}`} style={imageStyles}>
      {/* Placeholder while image is loading */}
      {placeholder && !loaded && (
        <div 
          className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" 
          style={{ aspectRatio: aspectRatio?.toString() }}
        />
      )}
      
      {/* Actual image */}
      {!hasError ? (
        <img
          src={deviceBasedSrc}
          srcSet={generateSrcSet(deviceBasedSrc)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={getLoadingAttribute()}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-auto transition-opacity duration-300${loadingClass}`}
          style={imageStyles}
          {...props}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-gray-400 dark:text-gray-600">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;