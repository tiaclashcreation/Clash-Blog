import type { Metadata } from "next";
import "../styles/index.css";
import { ThemeProvider } from "next-themes";
import Header from "./_components/header";
import Footer from "./_components/Footer";
import { getPosts } from "../sanity/lib/getPosts";
import FloatingCta from "./_components/FloatingCta";
import FloatingGroup from "./_components/FloatingGroup";
import { useEffect, useState } from "react";
import ThemeClientProvider from "./_components/ThemeClientProvider";

/*  
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

 */
export const metadata: Metadata = {
  title: "Clash Blog | Short-Form Content Strategy for Founders",
  description: "Expert insights on creating short-form video content that converts. Psychology-driven approaches, trends, and AI strategies for founders looking to drive real business results.",
  metadataBase: new URL('https://clashcreation.com/blog/'),
  alternates: {
    canonical: 'https://clashcreation.com/blog',
  },
  openGraph: {
    type: 'website',
    locale: 'en_UK',
    url: 'https://clashcreation.com/blog/',
    siteName: 'Clash Blog',
    title: 'Clash Blog | Short-Form Content Strategy for Founders',
    description: 'Expert insights on creating short-form video content that converts. Psychology-driven approaches, trends, and AI strategies for founders looking to drive real business results.',
    images: [
      {
        url: 'https://clashcreation.com/blog/clash-blog-og.png',
        width: 1200,
        height: 630,
        alt: 'Clash Blog - Short-Form Content for Founders',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clash Blog | Short-Form Content Strategy for Founders',
    description: 'Expert insights on creating short-form video content that converts. Psychology-driven approaches, trends, and AI strategies for founders looking to drive real business results.',
    images: ['https://clashcreation.com/blog/clash-blog-og.png'],
  },
  keywords: 'short-form content, founder marketing, TikTok strategy, content creation, business growth, neuro-writing, AI content strategy, LinkedIn content, Psychology, AI Creative, Script Writing, Short Form, Personal Branding',
  robots: {
    index: true,
    follow: true,
  }
};

function groupPostsByCategory(posts: any[]) {
  const grouped: { [category: string]: any[] } = {};
  posts.forEach(post => {
    (post.categories || []).forEach((cat: string) => {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        title: post.title,
        slug: post.slug.current || post.slug, // handle both cases
        imageUrl: post.mainImage?.asset?.url || "",
        categories: post.categories || [],
      });
    });
  });
  return grouped;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getPosts();
  const postsByCategory = groupPostsByCategory(posts);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/clash-logo.ico`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Clash Creation Blog",
              "url": "https://clashcreation.com/blog/",
              "description": "Expert insights on creating short-form video content that converts. Psychology-driven approaches, trends, and AI strategies for founders looking to drive real business results."
            })
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-theme-primary font-sans antialiased dark:bg-[var(--theme-bg-navy-gradient)]"
      >
        <ThemeClientProvider postsByCategory={postsByCategory}>
          {children}
        </ThemeClientProvider>
        <Footer className="mt-auto" />
      </body>
    </html>
  );
}
