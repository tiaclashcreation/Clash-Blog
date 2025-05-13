"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="w-full py-4 px-4 absolute top-0 right-0 z-10 transition-colors bg-theme-primary">
        <div className="container mx-auto flex items-center justify-end pr-4 gap-4">
          {/* Vertical Shortcut button */}
          <Link 
            href="https://www.verticalshortcut.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <div className="flex items-center">
              <Image 
                src="/clash-logo.png" 
                alt="vertical shortcut icon" 
                width={40} 
                height={40}
                className="h-10 w-10 rounded-full mr-2"
                priority
              />
              <span className="text-[#FF6B49] font-bold text-xl hidden sm:inline">the vertical shortcut</span>
            </div>
          </Link>
        </div>
      </header>
      {/* Custom floating theme toggle button in bottom right */}
      {mounted && (
        <button
          id="theme-toggle"
          data-theme-toggle=""
          className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-theme-primary border border-theme-border shadow-theme-sm hover-bubbly-sm"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            // Sun SVG for dark mode
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun h-5 w-5 text-theme-primary" data-theme-dark="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
          ) : (
            // Moon SVG for light mode
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon h-5 w-5 text-theme-primary" data-theme-light="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
          )}
        </button>
      )}
    </>
  );
} 