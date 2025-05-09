/**
 * Update Notification Component
 * 
 * Displays a notification banner when a service worker update is available.
 * This component will automatically detect when a new version of the site
 * is available and prompt the user to refresh.
 */

import { useState, useEffect } from 'react';
import { applyUpdate } from '../../utils/register-sw';

interface UpdateNotificationProps {
  position?: 'top' | 'bottom';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function UpdateNotification({
  position = 'bottom',
  autoClose = true,
  autoCloseDelay = 10000,
}: UpdateNotificationProps) {
  const [showUpdateBar, setShowUpdateBar] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      // This event fires when a new service worker has taken control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (mounted) setShowUpdateBar(true);
      });
      
      // Also listen for specific update messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE' && mounted) {
          setShowUpdateBar(true);
        }
      });
    }
    
    // Auto-close functionality if enabled
    let timer: number | undefined;
    if (showUpdateBar && autoClose) {
      timer = window.setTimeout(() => {
        if (mounted) setShowUpdateBar(false);
      }, autoCloseDelay);
    }
    
    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [showUpdateBar, autoClose, autoCloseDelay]);

  if (!showUpdateBar) return null;

  // Position classes based on prop
  const positionClasses = position === 'top' 
    ? 'top-0 left-0 right-0' 
    : 'bottom-0 left-0 right-0';

  return (
    <div 
      className={`fixed ${positionClasses} bg-primary-orange z-50 text-white p-4 flex justify-between items-center shadow-lg`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="font-medium">New content is available!</p>
      </div>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setShowUpdateBar(false)}
          className="text-white hover:underline px-2 py-1 text-sm"
          aria-label="Dismiss"
        >
          Later
        </button>
        <button 
          onClick={applyUpdate}
          className="bg-white text-primary-orange px-4 py-1 rounded font-medium"
          aria-label="Refresh to update"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}