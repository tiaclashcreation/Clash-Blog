import React from 'react';

/**
 * Component that adds hidden SEO-rich content to a page
 * The content is visually hidden but accessible to search engines
 */
interface SeoContentHelperProps {
  content: string;
}

export function SeoContentHelper({ content }: SeoContentHelperProps) {
  return (
    <div 
      className="sr-only" 
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0'
      }}
    >
      {content}
    </div>
  );
}

export default SeoContentHelper;