import { getPostBySlug } from '../../../sanity/lib/getPosts';
import { urlFor } from '../../../sanity/lib/image';
import { PostHeader } from '../../_components/post-header';
import { PostBody } from '../../_components/post-body';
import Container from '../../_components/container';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import React from 'react';

type PageProps = {
  params: Promise<{ slug: string }>;
}

const components = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 style={{
        fontSize: '1.6rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        margin: '2rem 0 1rem 0',
      }}>{children}</h2>
    ),
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{ color: '#1D96C2' }}
        className="hover:underline"
      >
        {children}
      </a>
    ),
  },
};

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  // Map Sanity data to expected shape
  const mappedPost = {
    title: post.title,
    coverImage: post.mainImage?.asset?.url ? urlFor(post.mainImage).url() : '',
    date: post.publishedAt,
    author: {
      name: post.author?.name || 'Unknown',
      picture: post.author?.image ? urlFor(post.author.image).url() : '/default-avatar.png',
    },
    content: post.body,
  };

  return (
    <main>
      <Container>
        <article className="mb-32">
          <PostHeader
            title={mappedPost.title}
            coverImage={mappedPost.coverImage}
            date={mappedPost.date}
            author={mappedPost.author}
          />
          {/* If you have markdown, convert to HTML and use PostBody. Otherwise, use PortableText. */}
          <div className="prose prose-invert max-w-[700px] mx-auto !px-0">
            <PortableText value={mappedPost.content} components={components} />
          </div>
        </article>
        {/* Newsletter Signup Section */}
        <section className="max-w-[700px] mx-auto mb-20 mt-0 bg-theme-bg-primary border border-theme-border rounded-2xl shadow-lg p-8 flex flex-col items-start text-left gap-4">
          <h3 className="text-2xl font-bold mb-2">Enjoying this post?</h3>
          <p className="text-theme-primary/80 text-base mb-2">'Join our weekly newsletter 'Like it or Not' — your weekly dose of harsh social media truths.</p>
          <p className="text-theme-primary/60 text-sm mb-4">Get weekly updates on the harsh social media truths no one else is telling you (and you definitely need to be hearing) from the #1 short-form agency in the world (probably).</p>
          <a
            href="https://clashcreation.kit.com/ccf67e8d02"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-secondary-teal text-white rounded-full shadow hover:scale-105 hover:bg-secondary-teal-light transition-all font-semibold text-lg mb-2"
          >
            Subscribe Now
          </a>
        </section>
      </Container>
    </main>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) return {};
  const imageUrl = post.mainImage?.asset?.url?.replace('clash-blog.vercel.app', 'blog.clashcreation.com') || "https://blog.clashcreation.com/clash-blog-og.png";
  const imageAlt = post.mainImage?.alt || post.title;
  const description = post.excerpt || "Read this post on Clash Blog.";
  const canonicalUrl = `https://blog.clashcreation.com/posts/${post.slug?.current || post.slug}`;
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.categories || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
    keywords: post.categories?.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
  };
} 