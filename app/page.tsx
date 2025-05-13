import { getPosts } from '../sanity/lib/getPosts';
import { urlFor } from '../sanity/lib/image';
import { HeroPost } from './_components/hero-post';
import { MoreStories } from './_components/more-stories';
import { Intro } from './_components/intro';
import Container from './_components/container';

export default async function Home() {
  const posts = await getPosts();

  if (!posts || posts.length === 0) {
    return <div className="text-center py-12">No posts found.</div>;
  }

  // Map Sanity data to the expected shape
  const allPosts = posts.map((post: any) => ({
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
        <Intro />
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
