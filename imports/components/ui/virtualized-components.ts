/**
 * This file exports virtualized components for use in the application.
 * These components improve performance by only rendering items that are visible in the viewport.
 */

export { default as VirtualizedList } from './virtualized-list';
export { default as VirtualizedGrid } from './virtualized-grid';
export { default as ResponsiveImage } from './responsive-image';

// Export all available virtualization components for easy imports
export default {
  VirtualizedList: './virtualized-list',
  VirtualizedGrid: './virtualized-grid',
  ResponsiveImage: './responsive-image',
};