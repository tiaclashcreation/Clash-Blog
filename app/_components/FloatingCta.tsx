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
        <div className="backdrop-blur-lg border border-theme-border shadow-2xl rounded-2xl p-3 w-56 max-w-xs flex flex-col gap-2 relative pt-7">
          <button
            className="absolute top-2 right-2 text-theme-primary/50 hover:text-theme-primary/80 text-lg font-bold p-1 rounded transition-colors"
            aria-label="Minimize CTA"
            onClick={() => { setVisible(false); setMinimized(true); onStateChange && onStateChange(); }}
          >
            −
          </button>
          <h4 className="text-xs font-bold text-theme-primary mb-1">The Vertical Shortcut</h4>
          <span className="text-[12px] text-theme-primary/40 dark:text-theme-primary/40 mb-1">We're not just writers. We've built over 1B+ views for founders and execs on short form. Turn your personal brand into a personal machine.</span>
          <Link
            href="https://www.verticalshortcut.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1 bg-[#FF6B49] text-white !text-white rounded-full shadow hover:scale-105 hover:bg-[#ff8a65] transition-all font-semibold text-sm justify-center"
          >
            🚀 Try The Vertical Shortcut
          </Link>
          <a
            href="https://clashcreation.kit.com/ccf67e8d02"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1 bg-secondary-teal text-white !text-white rounded-full shadow hover:scale-105 hover:bg-secondary-teal-light transition-all font-semibold text-sm justify-center"
            aria-label="Sign up for the newsletter"
          >
            📬 Sign up for the newsletter
          </a>
          <span className="text-[10px] text-theme-primary/60 dark:text-theme-primary/50 mt-1 text-center">No spam. Unsubscribe anytime.</span>
        </div>
      ) : (
        minimized && (
          <button
            className="bg-[#FF6B49] text-white rounded-full shadow px-4 py-2 font-semibold text-xs flex items-center gap-2 hover:scale-105 transition-all"
            onClick={() => { setVisible(true); setMinimized(false); onStateChange && onStateChange(); }}
            aria-label="Show CTA"
          >
            <span>Learn More</span>
          </button>
        )
      )}
    </div>
  );
} 