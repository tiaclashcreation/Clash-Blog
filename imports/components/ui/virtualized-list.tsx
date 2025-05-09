import React, { useState, useEffect, useRef } from 'react';
import { getDeviceInfo } from '../../utils/device-utils';

/**
 * Props for the VirtualizedList component
 */
interface VirtualizedListProps<T> {
  items: T[];                            // Array of items to render
  itemHeight: number;                    // Height of each item in pixels
  renderItem: (item: T, index: number) => React.ReactNode; // Function to render each item
  className?: string;                    // Optional class name for the container
  overscan?: number;                     // Number of items to render above/below viewport
  loadingPlaceholder?: React.ReactNode;  // Optional placeholder during initial render
  scrollingPlaceholder?: React.ReactNode; // Optional placeholder during fast scrolling
  onVisibilityChange?: (indexes: number[]) => void; // Optional callback when visible items change
  id?: string;                           // Optional ID for the container
  containerHeight?: number | string;     // Optional fixed height for the container
  horizontal?: boolean;                  // Optional horizontal mode
  emptyStateComponent?: React.ReactNode; // Optional component to display when list is empty
}

/**
 * Performance-optimized virtualized list component that only renders items in or near the viewport
 * Improves performance for large lists, especially on mobile devices
 */
function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  overscan = 3,
  loadingPlaceholder = null,
  scrollingPlaceholder = null,
  onVisibilityChange,
  id,
  containerHeight = 400,
  horizontal = false,
  emptyStateComponent = null,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isScrolling, setIsScrolling] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Device detection for performance optimization
  const deviceInfo = getDeviceInfo();
  const useSimplifiedVersion = deviceInfo.isLowEndDevice || deviceInfo.isMobile;

  // Calculate visible items based on container size and scroll position
  useEffect(() => {
    if (!containerRef.current) return;
    
    setInitialized(true);
    
    const calculateVisibleItems = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Get container dimensions
      const containerSize = horizontal
        ? container.clientWidth
        : container.clientHeight;
      
      // Calculate how many items can fit in the viewport plus overscan
      const visibleItemCount = Math.ceil(containerSize / itemHeight) + overscan * 2;
      
      // Calculate the first visible item index based on scroll position
      const scrollPosition = horizontal
        ? container.scrollLeft
        : container.scrollTop;
      
      const startIndex = Math.max(
        0,
        Math.floor(scrollPosition / itemHeight) - overscan
      );
      
      setStart(startIndex);
      setVisibleCount(visibleItemCount);
      
      // Report visible items
      if (onVisibilityChange) {
        const visibleIndexes = Array.from(
          { length: visibleItemCount },
          (_, i) => startIndex + i
        ).filter(index => index >= 0 && index < items.length);
        
        onVisibilityChange(visibleIndexes);
      }
    };
    
    // Calculate on mount
    calculateVisibleItems();
    
    // Set up scroll event listener
    const handleScroll = () => {
      // Use RAF for better performance
      requestAnimationFrame(() => {
        calculateVisibleItems();
        
        // Set scrolling state for potential placeholder display
        if (!isScrolling) {
          setIsScrolling(true);
          // Clear scrolling state after short delay
          setTimeout(() => setIsScrolling(false), 100);
        }
      });
    };
    
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateVisibleItems);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateVisibleItems);
    };
  }, [itemHeight, overscan, items.length, onVisibilityChange, isScrolling, horizontal]);
  
  // If no items, show empty state
  if (items.length === 0 && emptyStateComponent) {
    return <>{emptyStateComponent}</>;
  }
  
  // If not initialized yet, show loading placeholder
  if (!initialized && loadingPlaceholder) {
    return <>{loadingPlaceholder}</>;
  }
  
  // Calculate range of items to render
  const end = Math.min(start + visibleCount, items.length);
  const visibleItems = items.slice(start, end);
  
  // Calculate space before and after visible items to maintain scroll area
  const spacerBefore = start * itemHeight;
  const spacerAfter = (items.length - end) * itemHeight;
  
  // Style for the list container
  const containerStyle: React.CSSProperties = {
    height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight,
    position: 'relative',
    overflowY: horizontal ? 'hidden' : 'auto',
    overflowX: horizontal ? 'auto' : 'hidden',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  };
  
  // Style for the inner content wrapper
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    [horizontal ? 'width' : 'height']: `${items.length * itemHeight}px`,
    [horizontal ? 'height' : 'width']: '100%',
  };
  
  // For very low-end devices or simple lists, use a simplified approach
  if (useSimplifiedVersion && items.length < 50) {
    return (
      <div 
        ref={containerRef}
        className={`virtualized-list simplified ${className}`}
        style={containerStyle}
        id={id}
      >
        <div className="virtualized-list-content">
          {items.map((item, index) => (
            <div 
              key={index}
              style={{ height: `${itemHeight}px` }}
              className="virtualized-item"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`virtualized-list ${className}`}
      style={containerStyle}
      id={id}
    >
      <div style={contentStyle}>
        {/* Spacer before visible items */}
        <div 
          style={{ 
            [horizontal ? 'width' : 'height']: `${spacerBefore}px`,
            [horizontal ? 'left' : 'top']: 0,
            position: 'absolute',
            [horizontal ? 'height' : 'width']: '100%',
          }} 
        />
        
        {/* Visible items */}
        <div
          style={{
            position: 'absolute',
            [horizontal ? 'left' : 'top']: `${spacerBefore}px`,
            [horizontal ? 'height' : 'width']: '100%',
          }}
        >
          {isScrolling && scrollingPlaceholder ? (
            <div className="virtualized-scrolling-placeholder">
              {scrollingPlaceholder}
            </div>
          ) : (
            visibleItems.map((item, index) => (
              <div 
                key={start + index}
                style={{ 
                  [horizontal ? 'width' : 'height']: `${itemHeight}px`,
                  [horizontal ? 'display' : '']: horizontal ? 'inline-block' : '',
                }}
                className="virtualized-item"
                data-index={start + index}
              >
                {renderItem(item, start + index)}
              </div>
            ))
          )}
        </div>
        
        {/* Spacer after visible items */}
        <div 
          style={{ 
            [horizontal ? 'width' : 'height']: `${spacerAfter}px`,
            [horizontal ? 'left' : 'top']: `${spacerBefore + (end - start) * itemHeight}px`,
            position: 'absolute',
            [horizontal ? 'height' : 'width']: '100%',
          }} 
        />
      </div>
    </div>
  );
}

export default VirtualizedList;