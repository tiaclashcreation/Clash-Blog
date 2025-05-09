import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getDeviceInfo } from '../../utils/device-utils';

interface VirtualizedGridProps<T> {
  items: T[];                          // Array of items to display in the grid
  renderItem: (item: T, index: number) => React.ReactNode; // Render function for each item
  itemHeight: number;                  // Height of each item in pixels
  columns: number | { sm: number, md: number, lg: number }; // Number of columns or responsive config
  gap?: number;                        // Gap between items in pixels
  className?: string;                  // Optional className for the grid container
  style?: React.CSSProperties;         // Optional style for the grid container
  overscan?: number;                   // Number of rows to render beyond visible area
  scrollingPlaceholder?: React.ReactNode; // Optional placeholder during rapid scrolling
  onItemsInView?: (indexes: number[]) => void; // Callback when items enter viewport
  containerHeight?: number | string;   // Optional fixed height for the container
  emptyState?: React.ReactNode;        // Component to show when no items are available
  autoHeight?: boolean;                // Whether to auto-adjust height based on content
}

/**
 * Performance-optimized virtualized grid component for displaying large grids of items
 * Only renders items that are in or near the viewport
 * Especially useful for image grids and thumbnail collections
 */
function VirtualizedGrid<T>({
  items,
  renderItem,
  itemHeight,
  columns: columnsProp,
  gap = 16,
  className = '',
  style = {},
  overscan = 2,
  scrollingPlaceholder,
  onItemsInView,
  containerHeight = 600,
  emptyState,
  autoHeight = false,
}: VirtualizedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [visibleRowCount, setVisibleRowCount] = useState(10);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  // Device detection for optimized rendering
  const deviceInfo = getDeviceInfo();
  
  // Calculate responsive columns based on device and viewport
  const getResponsiveColumns = () => {
    if (typeof columnsProp === 'number') {
      return columnsProp;
    }
    
    const width = document.documentElement.clientWidth;
    if (width < 760) {
      return columnsProp.sm || 1;
    } else if (width < 1024) {
      return columnsProp.md || 2;
    } else {
      return columnsProp.lg || 3;
    }
  };
  
  const [columns, setColumns] = useState(getResponsiveColumns());
  
  // Update columns on resize
  useEffect(() => {
    const handleResize = () => {
      setColumns(getResponsiveColumns());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columnsProp]);
  
  // Row calculations
  const totalRows = useMemo(() => Math.ceil(items.length / columns), [items.length, columns]);
  const rowHeight = itemHeight + gap;
  
  // Calculate the range of rows to render
  useEffect(() => {
    if (!containerRef.current) return;
    
    const calculateVisibleRange = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      
      // Calculate row range with overscan
      const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
      const visibleRows = Math.ceil(height / rowHeight) + overscan * 2;
      
      setStart(startRow);
      setVisibleRowCount(Math.min(visibleRows, totalRows - startRow));
      
      // Call the visibility callback if provided
      if (onItemsInView) {
        const visibleIndices: number[] = [];
        for (let row = startRow; row < startRow + visibleRows && row < totalRows; row++) {
          for (let col = 0; col < columns; col++) {
            const index = row * columns + col;
            if (index < items.length) {
              visibleIndices.push(index);
            }
          }
        }
        onItemsInView(visibleIndices);
      }
    };
    
    // Calculate initially
    calculateVisibleRange();
    
    // Handle scroll events
    const handleScroll = () => {
      // Update scroll state for potential placeholder
      if (!isScrolling) {
        setIsScrolling(true);
      }
      
      // Clear existing timeout
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
        scrollTimeoutRef.current = null;
      }, 150);
      
      // Calculate visible range
      requestAnimationFrame(calculateVisibleRange);
    };
    
    containerRef.current.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateVisibleRange);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', calculateVisibleRange);
      
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [columns, itemHeight, overscan, rowHeight, totalRows, onItemsInView, isScrolling, items.length]);
  
  // Calculate visual properties
  const spacerBefore = start * rowHeight;
  const spacerAfter = Math.max(0, (totalRows - (start + visibleRowCount)) * rowHeight);
  
  // Create grid styles
  const gridContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
  };
  
  // Container styles
  const containerStyle: React.CSSProperties = {
    height: autoHeight ? 'auto' : (typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight),
    overflowY: 'auto',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
    ...style,
  };
  
  // Handle empty state
  if (items.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }
  
  // For very small lists or low-end devices, use a simplified version
  if (items.length < 20 || deviceInfo.isLowEndDevice) {
    return (
      <div 
        className={`virtualized-grid simplified ${className}`}
        style={{ ...containerStyle, overflowY: 'auto' }}
      >
        <div style={gridContainerStyle}>
          {items.map((item, index) => (
            <div 
              key={index}
              style={{ height: `${itemHeight}px` }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Render visible rows based on calculated range
  const visibleItems = useMemo(() => {
    const renderedItems = [];
    
    for (let rowIndex = start; rowIndex < start + visibleRowCount; rowIndex++) {
      for (let colIndex = 0; colIndex < columns; colIndex++) {
        const itemIndex = rowIndex * columns + colIndex;
        
        if (itemIndex < items.length) {
          renderedItems.push(
            <div
              key={itemIndex}
              style={{
                height: `${itemHeight}px`,
                gridColumn: colIndex + 1,
                gridRow: rowIndex - start + 1,
              }}
            >
              {renderItem(items[itemIndex], itemIndex)}
            </div>
          );
        }
      }
    }
    
    return renderedItems;
  }, [start, visibleRowCount, columns, items, itemHeight, renderItem]);
  
  return (
    <div
      ref={containerRef}
      className={`virtualized-grid ${className}`}
      style={containerStyle}
    >
      {/* Top spacer to maintain scroll position */}
      {spacerBefore > 0 && (
        <div style={{ height: `${spacerBefore}px` }} aria-hidden="true" />
      )}
      
      {/* Visible grid content */}
      {isScrolling && scrollingPlaceholder ? (
        <div className="virtualized-grid-scrolling-placeholder">
          {scrollingPlaceholder}
        </div>
      ) : (
        <div style={gridContainerStyle}>
          {visibleItems}
        </div>
      )}
      
      {/* Bottom spacer to maintain scroll position */}
      {spacerAfter > 0 && (
        <div style={{ height: `${spacerAfter}px` }} aria-hidden="true" />
      )}
    </div>
  );
}

export default VirtualizedGrid;