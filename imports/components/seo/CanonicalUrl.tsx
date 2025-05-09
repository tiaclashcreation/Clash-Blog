import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Component that manages canonical URLs based on current route
 */
export function CanonicalUrl() {
  const { pathname } = useLocation();
  const baseUrl = 'https://clashcreation.com';
  
  // Define the canonical path mapping
  const canonicalMapping = {
    '/': '/verticalshortcut/homepage', // Root redirects to new homepage path
    '/landing': '/verticalshortcut/homepage', // Landing page redirects to new homepage path
  };
  
  // Use the mapping or fall back to the current path
  const canonicalPath = canonicalMapping[pathname] || pathname;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}

export default CanonicalUrl; 