import { useEffect, useRef } from "react";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const prose = ref.current.querySelector('[class*="prose"]') as HTMLElement | null;
      if (prose) {
        prose.style.maxWidth = "700px";
        prose.style.paddingLeft = "0";
        prose.style.paddingRight = "0";
        prose.style.marginLeft = "auto";
        prose.style.marginRight = "auto";
        prose.style.boxSizing = "border-box";
      }
    }
  }, [content]);

  return (
    <div className="mx-auto py-12 md:py-20" ref={ref}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
} 