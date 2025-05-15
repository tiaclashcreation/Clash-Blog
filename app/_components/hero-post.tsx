"use client";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import Link from "next/link";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: { name: string; picture: string };
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <section>
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8 md:mb-16 gap-8">
        <div className="flex-shrink-0">
          <CoverImage title={title} src={coverImage} slug={slug} width={600} height={290} />
          <div className="flex items-center gap-2 text-base mt-4">
            <Avatar name={author.name} picture={author.picture} />
            <DateFormatter dateString={date} />
          </div>
        </div>
        <div className="flex-1 w-full">
          <h3 className="homepage-hero-title mb-2 text-4xl lg:text-5xl leading-tight">
            <Link
              href={`/posts/${slug}`}
              className="text-title-link hover:underline"
            >
              {title}
            </Link>
          </h3>
          <p className="text-lg leading-relaxed mb-2">{excerpt}</p>
        </div>
      </div>
    </section>
  );
} 