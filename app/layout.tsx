import type { Metadata } from "next";
import "../styles/index.css";
import { ThemeProvider } from "next-themes";
import Header from "./_components/header";
import { getPosts } from "../sanity/lib/getPosts";

/*  
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

 */
export const metadata: Metadata = {
  title: "Clash Blog | Short-Form Content Strategy for Founders",
  description: "Expert insights on creating short-form video content that converts. Psychology-driven approaches, trends, and AI strategies for founders looking to drive real business results.",
  metadataBase: new URL('https://clash-blog.vercel.app/'),
  openGraph: {
    type: 'website',
    locale: 'en_UK',
    url: 'https://clash-blog.vercel.app/',
    siteName: 'Clash Blog',
    title: 'Clash Blog | Short-Form Content Strategy for Founders',
    description: 'Expert insights on creating short-form video content that converts. Psychology-driven approaches, trends, and AI strategies for founders looking to drive real business results.',
    images: [
      {
        url: 'https://clash-blog.vercel.app/clash-blog-og.png',
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
    images: ['https://clash-blog.vercel.app/clash-blog-og.png'],
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
        <link rel="icon" type="image/x-icon" href="/clash-logo.ico" />
      </head>
      <body
        className="min-h-screen bg-theme-primary font-sans antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header postsByCategory={postsByCategory} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
