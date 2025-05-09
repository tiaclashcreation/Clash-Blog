// File: src/components/layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import SchemaScript from "./seo/SchemaScript";
import DynamicMeta from "./seo/DynamicMeta";
import CanonicalUrl from "./seo/CanonicalUrl";
import { useEffect, useRef, useState } from "react";
import { useDevice } from "../utils/animation-utils";
import { Analytics } from "@vercel/analytics/react";



/*
// ScrollToTop component that scrolls to top ONLY when navigating between different routes
function ScrollToTop() {
  const location = useLocation();
  const prevPathNameRef = useRef(location.pathname);
  const isFirstMountRef = useRef(true);
  
  useEffect(() => {
    // Skip the first render completely (prevents scroll on initial load)
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    
    // We check if this is an actual navigation (not just a component remount)
    if (prevPathNameRef.current !== location.pathname) {
      // Actual navigation happened - scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use 'instant' instead of 'smooth' to prevent janky experiences
      });
      
      // Update the ref for next comparison
      prevPathNameRef.current = location.pathname;
    }
  }, [location.pathname]);
  
  return
}
  */

export default function Layout() {
  const { isMobile } = useDevice();
  const [isRendered, setIsRendered] = useState(false);

  // Ensure hydration on mobile
  useEffect(() => {
    // Force a re-render to ensure hydration
    setIsRendered(true);
  }, []);

  return (
    <>
      {/*<ScrollToTop />*/}
      <SchemaScript />
      <DynamicMeta />
      <CanonicalUrl />
      <div className={`min-h-screen ${isRendered ? 'bg-theme-gradient' : 'bg-white dark:bg-gray-900'}`}>
        {/* Main content */}
        <main>
          <Outlet />
        </main>

        {/* Theme toggle */}
        <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
          <ThemeToggle />
        </div>
        
        {/* Service worker update notification removed - we handle updates silently now */}
      </div>
    </>
  );
}