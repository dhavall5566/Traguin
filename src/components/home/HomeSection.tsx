import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeSectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div";
  spacing?: "default" | "compact" | "none";
  container?: "default" | "content" | "none";
  tone?: "default" | "muted" | "surface";
  children: ReactNode;
} & ComponentPropsWithoutRef<"section">;

export function HomeSection({
  id,
  className,
  containerClassName,
  as: Tag = "section",
  spacing = "default",
  container = "default",
  tone = "default",
  children,
  ...rest
}: HomeSectionProps) {
  const inner =
    container === "none" ? (
      children
    ) : (
      <div
        className={cn(
          "site-container",
          container === "content" && "site-container--content",
          containerClassName
        )}
      >
        {children}
      </div>
    );

  return (
    <Tag
      id={id}
      className={cn(
        "home-section",
        spacing === "compact" && "home-section--compact",
        spacing === "none" && "home-section--flush-y",
        tone === "muted" && "home-section--muted",
        tone === "surface" && "home-section--surface",
        className
      )}
      {...rest}
    >
      {inner}
    </Tag>
  );
}

export function HomeSectionActions({
  className,
  align = "center",
  children,
}: {
  className?: string;
  align?: "center" | "between";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "home-section-actions mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5",
        align === "center" && "items-center justify-center",
        align === "between" && "items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}
