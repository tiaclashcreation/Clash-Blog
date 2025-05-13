"use client";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';

// Define types
interface Post {
  title: string;
  slug: string;
  imageUrl: string;
  categories: string[];
}
interface PostsByCategory {
  [category: string]: Post[];
}

export default function Header({ postsByCategory }: { postsByCategory: PostsByCategory }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !(ref.current as HTMLElement).contains(e.target as Node)) setOpenDropdown(null);
    }
    if (openDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  const categories = ["AI", "Trends", "Founders", "Psychology"];

  return (
    <>
      <header ref={ref} className="w-full py-4 px-4 fixed top-0 right-0 z-20 transition-colors bg-theme-primary shadow-md">
        <div className="container mx-auto flex items-center justify-between pr-4 gap-4">
          {/* Clash Blog stacked title */}
          <Link href="/" className="flex flex-col items-start justify-center select-none" style={{ minWidth: '80px' }}>
            <span className="text-navy text-2xl md:text-3xl font-bold leading-none tracking-tighter">Clash</span>
            <span className="text-navy text-2xl md:text-3xl font-bold leading-none tracking-tighter">Blog.</span>
          </Link>
          {/* Navbar links with dropdowns */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex gap-6 md:gap-10 text-lg md:text-xl font-semibold">
              {categories.map((cat) => (
                <li key={cat} className="relative">
                  <button
                    className="px-4 py-2 font-semibold text-lg"
                    onClick={() => setOpenDropdown(openDropdown === cat ? null : cat)}
                    aria-expanded={openDropdown === cat}
                    aria-controls={`dropdown-${cat}`}
                  >
                    {cat}
                  </button>
                  {openDropdown === cat && (
                    <div
                      id={`dropdown-${cat}`}
                      className="absolute left-0 mt-2 w-80 bg-theme-bg-primary border border-theme-border rounded-lg shadow-lg z-50"
                    >
                      <ul>
                        {(postsByCategory[cat] || []).map((post) => (
                          <li key={post.slug} className="border-b border-theme-border last:border-0">
                            <Link
                              href={`/posts/${post.slug}`}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-theme-bg-secondary transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Image
                                src={post.imageUrl || "/default.jpg"}
                                alt={post.title}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span className="font-medium text-theme-primary">{post.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
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