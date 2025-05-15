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
            className="bg-secondary-teal text-white rounded-full shadow px-6 py-3 font-semibold text-base flex items-center justify-center gap-2 hover:scale-105 transition-all min-w-[140px] text-center"
            onClick={() => { setVisible(true); setMinimized(false); onStateChange && onStateChange(); }}
            aria-label="Show CTA"
          >
            <span className="w-full text-center">Only 9 Spots Left</span>
          </button>
        )
      )}
    </div>
  );
} 