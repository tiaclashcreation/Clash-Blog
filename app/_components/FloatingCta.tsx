"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function FloatingCta({ onStateChange }: { onStateChange?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [isAbsolute, setIsAbsolute] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const footer = document.querySelector('footer');
      const cta = ctaRef.current;
      if (!footer || !cta) return;
      const footerRect = footer.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // If the bottom of the CTA would go below the top of the footer
      if (footerRect.top < windowHeight - ctaRect.height - 16) {
        setIsAbsolute(true);
      } else {
        setIsAbsolute(false);
      }
    }
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (!visible && !minimized) return null;

  return (
    <div className="w-full flex flex-col items-end">
      {visible ? (
        <div className="backdrop-blur-lg border border-theme-border shadow-2xl rounded-2xl p-4 w-64 max-w-sm flex flex-col gap-3 relative pt-9">
          <button
            className="absolute top-2 right-2 text-theme-primary/50 hover:text-theme-primary/80 text-xl font-bold p-2 rounded transition-colors"
            aria-label="Minimize CTA"
            onClick={() => { setVisible(false); setMinimized(true); onStateChange && onStateChange(); }}
          >
            −
          </button>
          <h4 className="text-sm font-bold text-theme-primary mb-2">The Vertical Shortcut</h4>
          <span className="text-[14px] text-theme-primary/40 dark:text-theme-primary/40 mb-2">We're not just writers. We've built over 1B+ views for founders and execs on short form. Turn your personal brand into a personal machine.</span>
          <Link
            href="https://www.verticalshortcut.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF6B49] text-white !text-white rounded-full shadow hover:scale-105 hover:bg-[#ff8a65] transition-all font-semibold text-base min-w-[180px] text-center"
          >
            <span className="w-full text-center">🚀 Apply Now</span>
          </Link>
        </div>
      ) : (
        minimized && (
          <button
            className="relative group rounded-full shadow px-6 py-3 font-semibold text-base flex items-center justify-center gap-2 hover:scale-105 transition-all min-w-[140px] text-center overflow-hidden border border-white/20 backdrop-blur-sm"
            style={{
              color: 'white',
              border: 'none',
              opacity: 1,
            }}
            onClick={() => { setVisible(true); setMinimized(false); onStateChange && onStateChange(); }}
            aria-label="Show CTA"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-accent-coral)] via-[var(--theme-primary)] to-[var(--theme-accent-secondary)] opacity-90 animate-gradient-slow z-0" />
            {/* Blurred white overlay for shine */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out z-10" />
            {/* Content */}
            <span className="w-full text-center relative z-20 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]">Only 7 Spots Left</span>
          </button>
        )
      )}
    </div>
  );
} 