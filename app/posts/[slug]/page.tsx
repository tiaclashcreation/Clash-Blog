import { getPostBySlug } from '../../../sanity/lib/getPosts';
import { urlFor } from '../../../sanity/lib/image';
import { PostHeader } from '../../_components/post-header';
import { PostBody } from '../../_components/post-body';
import Container from '../../_components/container';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';

type PageProps = {
  params: Promise<{ slug: string }>;
}

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
          <div className="prose prose-invert max-w-4xl px-4 mx-auto">
            <PortableText value={mappedPost.content} />
          </div>
        </article>
      </Container>
    </main>
  );
} 