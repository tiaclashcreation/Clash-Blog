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
      </Container>
    </main>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) return {};
  const imageUrl = post.mainImage?.asset?.url || "https://clash-blog.vercel.app/clash-blog-og.png";
  const imageAlt = post.mainImage?.alt || post.title;
  const description = post.excerpt || "Read this post on Clash Blog.";
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://clash-blog.vercel.app/posts/${post.slug?.current || post.slug}`,
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
  };
} 