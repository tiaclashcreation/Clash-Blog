"use client";
import { useTheme } from "next-themes";
import FloatingCta from "./FloatingCta";
import { useEffect, useRef, useState, useCallback } from "react";

export default function FloatingGroup() {
  const { resolvedTheme, setTheme } = useTheme();
  const groupRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [absoluteTop, setAbsoluteTop] = useState<number | null>(null);
  // Track a key to force re-render/height recalc when CTA is minimized/restored
  const [ctaKey, setCtaKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll handler as a stable callback
  const handleScroll = useCallback(() => {
    const footer = document.querySelector('footer');
    const group = groupRef.current;
    if (!footer || !group) return;
    const footerRect = footer.getBoundingClientRect();
    const groupRect = group.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const margin = 24; // px above the footer
    // Distance from top of document to top of footer
    const footerTop = window.scrollY + footerRect.top;
    // Distance from top of document to bottom of viewport
    const scrollBottom = window.scrollY + windowHeight;
    // If the group would overlap the footer, stick it above the footer
    if (scrollBottom > footerTop - margin) {
      setIsSticky(true);
      setAbsoluteTop(footerTop - groupRect.height - margin);
    } else {
      setIsSticky(false);
      setAbsoluteTop(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll, ctaKey]);

  // Handler to pass to FloatingCta to trigger recalc on minimize/restore
  const handleCtaStateChange = () => {
    setCtaKey(k => k + 1);
    setTimeout(() => handleScroll(), 0); // recalc after DOM update
  };

  return (
    <div
      ref={groupRef}
      className={`flex flex-col items-end gap-4 z-60 ${isSticky ? 'absolute' : 'fixed'} right-6 ${isSticky ? '' : 'bottom-6'}`}
      style={isSticky && absoluteTop !== null ? { top: absoluteTop, bottom: 'unset' } : {}}
    >
      <FloatingCta onStateChange={handleCtaStateChange} />
      <button
        id="theme-toggle"
        data-theme-toggle=""
        className="p-2 rounded-full bg-theme-primary border border-theme-border shadow-theme-sm hover-bubbly-sm"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        {mounted && (
          resolvedTheme === "dark" ? (
          // Sun SVG for dark mode
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun h-5 w-5 text-theme-primary" data-theme-dark="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
        ) : (
          // Moon SVG for light mode
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon h-5 w-5 text-theme-primary" data-theme-light="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
          )
        )}
      </button>
    </div>
  );
} 