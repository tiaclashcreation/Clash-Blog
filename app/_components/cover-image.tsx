import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  slug?: string;
  width?: number;
  height?: number;
};

const CoverImage = ({ title, src, slug, width = 700, height = 340 }: Props) => {
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn("shadow-sm mx-auto", {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      width={width}
      height={height}
    />
  );
  return (
    <div className="sm:mx-0 flex justify-center">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage; 