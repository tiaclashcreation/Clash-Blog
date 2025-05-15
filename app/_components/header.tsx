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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const [isAbsolute, setIsAbsolute] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !(ref.current as HTMLElement).contains(e.target as Node)) setOpenDropdown(null);
    }
    if (openDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  useEffect(() => {
    function handleScroll() {
      const footer = document.querySelector('footer');
      const toggle = themeToggleRef.current;
      if (!footer || !toggle) return;
      const footerRect = footer.getBoundingClientRect();
      const toggleRect = toggle.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const ctaOffset = 80; // px, matches CTA's offset
      const toggleOffset = 16; // px, below CTA
      // Calculate the distance from the top of the document to the bottom of the viewport
      const scrollBottom = window.scrollY + windowHeight;
      // Calculate the distance from the top of the document to the top of the footer
      const footerTop = window.scrollY + footerRect.top;
      // If the button would overlap the footer, switch to absolute and position just above the footer
      if (scrollBottom > footerTop - toggleOffset) {
        setIsAbsolute(true);
        if (toggle) {
          toggle.style.top = `${footerTop - toggle.offsetHeight - toggleOffset}px`;
        }
      } else {
        setIsAbsolute(false);
        if (toggle) {
          toggle.style.top = '';
        }
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

  const categories = ["AI", "Trends", "Founders", "Psychology"];

  // Side drawer close on route change or escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    if (drawerOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  return (
    <>
      <header ref={ref} className="w-full py-4 px-4 fixed top-0 right-0 z-20 transition-colors bg-theme-primary shadow-md dark:bg-[var(--theme-bg-navy-gradient)]">
        <div className="container mx-auto flex items-center justify-between pr-4 gap-4">
          {/* Clash Blog stacked title */}
          <Link href="/" className="flex flex-col items-start justify-center select-none" style={{ minWidth: '80px' }}>
            <span className="clash-header-text text-navy text-2xl md:text-3xl font-bold leading-none tracking-tighter">Clash</span>
            <span className="clash-header-text text-navy text-2xl md:text-3xl font-bold leading-none tracking-tighter">Blog.</span>
          </Link>
          {/* Desktop Navbar links with dropdowns */}
          <nav className="flex-1 flex justify-center hidden md:flex">
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
                              className="flex items-center gap-3 px-4 py-2 hover:bg-theme-bg-secondary transition-colors text-theme-primary font-medium"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <Image
                                src={post.imageUrl || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/default.jpg`}
                                alt={post.title}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span>{post.title}</span>
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
          {/* Desktop Vertical Shortcut button */}
          <Link 
            href="https://www.verticalshortcut.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 hidden md:flex"
          >
            <div className="flex items-center">
              <img 
                src="/blog/clash-logo.png" 
                alt="vertical shortcut icon" 
                width={40} 
                height={40}
                className="h-10 w-10 rounded-full mr-2"
              />
              <span
                className="ml-3 text-xl font-medium vs-text-gradient-nav-title"
              >
                the vertical shortcut.
              </span>
            </div>
          </Link>
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </header>
      {/* Side drawer for mobile nav */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex md:hidden">
          <div className="ml-auto w-4/5 max-w-xs h-full bg-theme-primary shadow-lg flex flex-col relative animate-slide-in">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded focus:outline-none"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" /></svg>
            </button>
            {/* Clash logo at top */}
            <Link
              href="https://www.verticalshortcut.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center mt-8 mb-6"
              onClick={() => setDrawerOpen(false)}
            >
              <img
                src="/blog/clash-logo.png"
                alt="vertical shortcut icon"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
            </Link>
            {/* Category accordions */}
            <nav className="flex-1 overflow-y-auto px-4">
              {categories.map((cat) => (
                <div key={cat} className="mb-2">
                  <button
                    className="w-full flex justify-between items-center py-3 px-2 font-semibold text-lg border-b border-theme-border focus:outline-none"
                    onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                    aria-expanded={expandedCategory === cat}
                  >
                    <span>{cat}</span>
                    <svg
                      className={`transform transition-transform ${expandedCategory === cat ? "rotate-90" : "rotate-0"}`}
                      width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {expandedCategory === cat && (
                    <ul className="pl-2 py-2">
                      {(postsByCategory[cat] || []).map((post) => (
                        <li key={post.slug} className="mb-2">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-theme-bg-secondary transition-colors text-theme-primary font-medium text-base"
                            onClick={() => setDrawerOpen(false)}
                          >
                            <Image
                              src={post.imageUrl || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/default.jpg`}
                              alt={post.title}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span>{post.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 