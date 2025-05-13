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
  title: "Clash Blog",
  description: "A modern blog built with Next.js and Sanity",
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
