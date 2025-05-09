import Link from 'next/link';
import { VSHeading, VSText } from './ui/vs-text';
import { VSButton } from './ui/vs-button';

function getExcerpt(body: any[], maxLength = 180) {
  if (!Array.isArray(body)) return '';
  let text = '';
  for (const block of body) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      text += block.children.map((child: any) => child.text).join(' ');
    }
    if (text.length > maxLength) break;
  }
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}

export default function BlogCard({ post }: { post: any }) {
  return (
    <div className="rounded-lg bg-[var(--background)] shadow-lg flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl">
      {post.mainImage?.asset?.url && (
        <img
          src={post.mainImage.asset.url}
          alt={post.mainImage.alt || post.title}
          className="w-full h-56 object-cover rounded-t"
          style={{ minHeight: '14rem', maxHeight: '14rem' }}
        />
      )}
      <div className="p-6 flex flex-col flex-1">
        <VSHeading size="lg" className="mb-2">{post.title}</VSHeading>
        <VSText size="md" className="mb-2 text-gray-500">
          By {post.author} • {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
        </VSText>
        <VSText size="sm" className="mb-4 text-gray-300">
          {getExcerpt(post.body, 180)}
        </VSText>
        <Link href={`/posts/${post.slug.current}`} passHref legacyBehavior>
          <VSButton variant="primary" size="sm" className="mt-auto">
            Read More
          </VSButton>
        </Link>
      </div>
    </div>
  );
} 