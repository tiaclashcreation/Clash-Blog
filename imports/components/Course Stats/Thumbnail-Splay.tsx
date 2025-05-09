import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getDeviceInfo } from '../../utils/device-utils';
import ResponsiveImage from '../ui/responsive-image';
import VirtualizedGrid from '../ui/virtualized-grid';

// @ts-expect-error -- Vite's import.meta.glob typing issue
const thumbnailContext = import.meta.glob('/assets/main/BestThumbnails-webp/*.webp', { eager: true });

interface ThumbnailSplayProps {
  className?: string;
  sizeMultiplier?: number; // Default will be 1
}

const ThumbnailSplay = ({ className = '', sizeMultiplier = 1 }: ThumbnailSplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Get device info for optimization decisions
  const deviceInfo = getDeviceInfo();
  const isMobile = deviceInfo.isMobile;
  const isLowEndDevice = deviceInfo.isLowEndDevice;

  // Base dimensions that will be multiplied by sizeMultiplier
  const baseWidth = 192; // 48 * 4 = 192px (w-48 in Tailwind)
  const baseHeight = 128; // 32 * 4 = 128px (h-32 in Tailwind)
  
  // Use smaller thumbnails on mobile for better performance
  const effectiveWidth = isMobile ? baseWidth * 0.75 * sizeMultiplier : baseWidth * sizeMultiplier;
  const effectiveHeight = isMobile ? baseHeight * 0.75 * sizeMultiplier : baseHeight * sizeMultiplier;

  useEffect(() => {
    // Load all thumbnail paths
    const paths = Object.values(thumbnailContext).map(module => (module as { default: string }).default);
    // Filter out any system files (like ._Boulder10.webp)
    const filteredThumbnails = paths.filter(path => !path.includes('/._'));
    
    // Limit the number of thumbnails on mobile to improve performance
    if (isMobile) {
      setThumbnails(filteredThumbnails.slice(0, 12));
    } else {
      setThumbnails(filteredThumbnails);
    }
  }, [isMobile]);

  // Initialize animations when thumbnails are loaded
  useEffect(() => {
    if (!containerRef.current || thumbnails.length === 0) return;
    
    // Only do the fancy animations on desktop
    if (!isMobile && !isLowEndDevice) {
      const thumbnailElements = containerRef.current.querySelectorAll('.thumbnail-item');
      
      // Initial random arrangement with VS-style starting positions
      gsap.set(thumbnailElements, {
        x: 'random(-120, 120)',
        y: 'random(-60, 60)',
        rotation: 'random(-20, 20)',
        scale: 0.95,
        opacity: 0,
      });

      // Fade in animation with VS-style bubbly effect
      gsap.to(thumbnailElements, {
        opacity: 0.7,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "back.out(1.2)",
      });
    } else {
      // Simplified animation for mobile
      const thumbnailElements = containerRef.current.querySelectorAll('.thumbnail-item');
      
      gsap.set(thumbnailElements, {
        opacity: 0,
        y: 20,
      });
      
      gsap.to(thumbnailElements, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      });
    }
  }, [thumbnails, isMobile, isLowEndDevice]);

  const handleMouseEnter = (index: number) => {
    // Skip animations on mobile
    if (isMobile || isLowEndDevice) return;
    
    setSelectedIndex(index);
    if (!containerRef.current) return;

    const thumbnailElements = containerRef.current.querySelectorAll('.thumbnail-item');
    if (!thumbnailElements[index]) return;
    
    // VS-style hover animation
    gsap.to(thumbnailElements[index], {
      scale: 1.2,
      rotation: 0,
      opacity: 1,
      zIndex: 10,
      duration: 0.4,
      ease: "back.out(1.7)",
    });

    // Slightly push away other thumbnails with VS-style effect
    gsap.to(
      Array.from(thumbnailElements)
        .filter((_, i) => i !== index),
      {
        scale: 0.7,
        opacity: 0.5,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  };

  const handleMouseLeave = (_index: number) => {
    // Skip animations on mobile
    if (isMobile || isLowEndDevice) return;
    
    setSelectedIndex(null);
    if (!containerRef.current) return;

    const thumbnailElements = containerRef.current.querySelectorAll('.thumbnail-item');
    
    // Reset all thumbnails to original state with VS-style animation
    gsap.to(thumbnailElements, {
      scale: 1,
      rotation: (_i) => `random(-20, 20)`,
      opacity: 0.7,
      zIndex: 1,
      duration: 0.4,
      ease: "back.out(1.2)",
    });
  };

  // On mobile, use a responsive grid layout instead of the scattered splay
  if (isMobile) {
    const gridColumns = { 
      sm: 2, // Mobile: 2 columns
      md: 3, // Tablet: 3 columns
      lg: 4  // Desktop: 4 columns
    };
    
    // Render a virtualized grid for mobile
    return (
      <div className={`${className}`}>
        <VirtualizedGrid
          items={thumbnails}
          columns={gridColumns}
          itemHeight={effectiveHeight}
          gap={12}
          containerHeight={400 * sizeMultiplier}
          className="w-full"
          renderItem={(thumbnail, index) => (
            <div 
              className="thumbnail-item rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300"
              style={{
                width: '100%',
                height: `${effectiveHeight}px`,
              }}
            >
              <ResponsiveImage
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                blur={true}
                aboveTheFold={index < 6}
              />
            </div>
          )}
        />
      </div>
    );
  }

  // Desktop: keep the original scattered layout
  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: `${400 * sizeMultiplier}px`
      }}
    >
      {thumbnails.map((thumbnail, index) => (
        <div
          key={thumbnail}
          className={`
            thumbnail-item
            absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
            rounded-lg overflow-hidden cursor-pointer
            transition-shadow duration-300
            ${selectedIndex === index ? 'shadow-xl' : 'shadow-md'}
          `}
          style={{
            width: `${effectiveWidth}px`,
            height: `${effectiveHeight}px`
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <ResponsiveImage
            src={thumbnail}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index < 9 ? "eager" : "lazy"}
            blur={true}
            aboveTheFold={index < 9}
          />
        </div>
      ))}
    </div>
  );
};

export default ThumbnailSplay;
