import type { Metadata } from "next";
import "../styles/index.css";
import { ThemeProvider } from "next-themes";
import Header from "./_components/header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
