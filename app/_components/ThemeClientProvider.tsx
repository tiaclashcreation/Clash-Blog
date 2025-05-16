"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import Header from "./header";
import FloatingGroup from "./FloatingGroup";

export default function ThemeClientProvider({ postsByCategory, children }: { postsByCategory: any, children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Header postsByCategory={postsByCategory} />
      {children}
      <FloatingGroup />
    </ThemeProvider>
  );
} 