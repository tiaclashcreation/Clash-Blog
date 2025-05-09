import * as React from "react";
import { cn } from "../../lib/utils";
import { Plus, ArrowUpRight } from "lucide-react";

function Slide({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isExpanded,
  ...props
}: React.ComponentProps<"div"> & { isExpanded?: boolean }) {
  return (
    <div
      data-slot="slide"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl shadow-theme-md bg-theme-gradient transition-all duration-[var(--theme-transition-bounce)]",
        className,
      )}
      {...props}
    />
  );
}

function SlideTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="slide-title"
      className={cn("text-lg font-semibold tracking-tight text-theme-primary transition-colors duration-[var(--theme-transition-normal)]", className)}
      {...props}
    />
  );
}

function SlideDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="slide-description"
      className={cn("text-sm text-balance text-theme-secondary transition-colors duration-[var(--theme-transition-normal)]", className)}
      {...props}
    />
  );
}

function SlideContent({
  className,
  isExpanded,
  ...props
}: React.ComponentProps<"div"> & { isExpanded?: boolean }) {
  return (
    <div
      data-slot="slide-content"
      className={cn(
        "flex flex-col gap-2 p-6 transition-opacity duration-300",
        isExpanded ? "opacity-0" : "opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function SlideVisual({
  className,
  isExpanded,
  ...props
}: React.ComponentProps<"div"> & { isExpanded?: boolean }) {
  return (
    <div
      data-slot="slide-visual"
      className={cn(
        "flex items-center transition-opacity duration-300",
        isExpanded ? "opacity-0" : "opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function SlideExpandedContent({
  className,
  isExpanded,
  ...props
}: React.ComponentProps<"div"> & { isExpanded?: boolean }) {
  return (
    <div
      data-slot="slide-expanded-content"
      className={cn(
        "absolute inset-6 text-lg text-balance text-theme-secondary transition-all duration-[var(--theme-transition-normal)]",
        isExpanded ? "opacity-100" : "opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SlideButton({
  className,
  isExpanded,
  icon = "more",
  ...props
}: React.ComponentProps<"button"> & {
  isExpanded?: boolean;
  icon?: "link" | "more";
}) {
  return (
    <button
      data-slot="slide-button"
      {...props}
      className={cn(
        "bg-theme-accent-secondary pointer-events-none absolute right-6 bottom-6 z-10 block p-4 rounded-full transition-all duration-[var(--theme-transition-normal)] shadow-theme-sm",
        className,
      )}
    >
      {icon === "link" ? (
        <ArrowUpRight className="size-4 text-theme-on-primary" />
      ) : (
        <Plus
          className={cn(
            "size-4 transition-all text-white",
            isExpanded ? "rotate-45" : "group-hover:rotate-90",
          )}
        />
      )}
    </button>
  );
}

export {
  Slide,
  SlideTitle,
  SlideDescription,
  SlideContent,
  SlideVisual,
  SlideButton,
  SlideExpandedContent,
};
