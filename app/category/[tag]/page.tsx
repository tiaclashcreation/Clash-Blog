import { getPosts } from '../../../sanity/lib/getPosts';
import { urlFor } from '../../../sanity/lib/image';
import { HeroPost } from '../../_components/hero-post';
import { MoreStories } from '../../_components/more-stories';
import Container from '../../_components/container';
import { notFound } from 'next/navigation';
import { Intro } from '../../_components/intro';

interface TagPageProps {
  params: { tag: string };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = params.tag;
  const posts = await getPosts();
  const filteredPosts = posts.filter((post: any) =>
    (post.categories || []).map((c: string) => c.toLowerCase()).includes(tag.toLowerCase())
  );

  if (!filteredPosts || filteredPosts.length === 0) {
    return <div className="text-center py-12">No posts found for tag "{tag}".</div>;
  }

  // Map Sanity data to the expected shape
  const allPosts = filteredPosts.map((post: any) => ({
    slug: post.slug?.current || '',
    title: post.title,
    date: post.publishedAt,
    coverImage: post.mainImage?.asset?.url ? urlFor(post.mainImage).url() : '',
    author: {
      name: post.author?.name || 'Unknown',
      picture: post.author?.image ? urlFor(post.author.image).url() : '/default-avatar.png',
    },
    excerpt: post.excerpt || '',
    content: post.body || '',
  }));

  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-12 pt-32 md:pt-40 text-left md:text-left ml-0 md:ml-0">
          {tag.toLowerCase() === 'ai' ? 'AI' : tag.charAt(0).toUpperCase() + tag.slice(1)}
        </h1>
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
} 