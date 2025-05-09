import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Component that updates meta tags based on current route
 */
export function DynamicMeta() {
  const location = useLocation();
  
  // Page-specific meta based on current route
  const metaConfig: Record<string, { title: string; description: string }> = {
    '/': {
      title: 'Vertical Shortcut | Executive Video Content & Short Form Video Agency',
      description: 'The premium 10-week short form video program for executives and founders who want to master vertical video content strategy. Learn how executives use TikTok, LinkedIn video for executives, and short form video production techniques specifically for business leaders.'
    },
    '/verticalshortcut/homepage': {
      title: 'Vertical Shortcut | Executive Video Content & Short Form Video Agency',
      description: 'The premium 10-week short form video program for executives and founders who want to master vertical video content strategy. Learn how executives use TikTok, LinkedIn video for executives, and short form video production techniques specifically for business leaders.'
    },
    '/landing': {
      title: 'Vertical Shortcut | Executive Video Content & Short Form Video Agency',
      description: 'The premium 10-week short form video program for executives and founders who want to master vertical video content strategy. Learn how executives use TikTok, LinkedIn video for executives, and short form video production techniques specifically for business leaders.'
    },
    '/application-form': {
      title: 'Apply Now | Executive Video Content Program | Vertical Shortcut',
      description: 'Start your executive video content journey with our vertical video training program. Apply now to learn CEO video strategy, LinkedIn video for executives, and personal branding techniques from the #1 short form video agency.'
    }
    // Add route-specific meta for each page
  };
  
  const currentMeta = metaConfig[location.pathname] || metaConfig['/'];
  
  return (
    <Helmet>
      <title>{currentMeta.title}</title>
      <meta name="description" content={currentMeta.description} />
      <meta property="og:title" content={currentMeta.title} />
      <meta property="og:description" content={currentMeta.description} />
      <meta name="twitter:title" content={currentMeta.title} />
      <meta name="twitter:description" content={currentMeta.description} />
    </Helmet>
  );
}

export default DynamicMeta; 