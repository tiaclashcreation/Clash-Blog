"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const TAGS = ["AI", "Founders", "Psychology", "Trends"];

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`w-full bg-theme-primary border-t border-theme-border py-8 mt-16 z-60 relative dark:bg-[var(--theme-bg-navy-gradient)] ${className}`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        {/* Left: Vertical Shortcut + Tags */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-3 md:w-2/3 justify-start">
          <Link href="https://www.verticalshortcut.com/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 flex items-center">
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
          </Link>
          <div className="flex flex-wrap md:flex-nowrap gap-3 ml-0 md:ml-4">
            {TAGS.map(tag => (
              <Link
                key={tag}
                href={`/category/${tag.toLowerCase()}`}
                className="font-semibold text-lg md:text-xl text-navy dark:text-[#46b6b6] px-2 py-1 hover:text-secondary-teal transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
        {/* Right: Newsletter, LinkedIn, TikTok */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:w-1/3 justify-end">
          <a
            href="mailto:creators@clashcreation.com"
            className="text-secondary-teal transition-colors font-bold text-lg mr-2"
            aria-label="Contact"
          >
            Contact
          </a>
          <div className="flex flex-row items-center gap-3">
            <a
              href="https://clashcreation.kit.com/ccf67e8d02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-teal transition-colors touch-target"
              aria-label="Subscribe to our newsletter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/joden-newman/"
              className="text-secondary-teal transition-colors touch-target"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22" 
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@jodenclash"
              className="text-secondary-teal transition-colors touch-target"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path d="M20 6a3 3 0 0 1-3-3h-3.5v12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 2.5-2.5V9a6 6 0 0 0-6 6 6 6 0 0 0 12 0V8a3 3 0 0 0 3 3"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-theme-primary mt-6 opacity-70">
        &copy; {new Date().getFullYear()} Clash Blog. All rights reserved.
      </div>
    </footer>
  );
} 