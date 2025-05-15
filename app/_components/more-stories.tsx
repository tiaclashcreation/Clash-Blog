import PostPreview from "./post-preview";

type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: { name: string; picture: string };
  excerpt: string;
};

type Props = {
  posts: Post[];
};

export function MoreStories({ posts }: Props) {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 lg:gap-x-10 gap-y-8 md:gap-y-12 mb-32">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  );
} 