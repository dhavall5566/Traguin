import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl text-foreground md:text-5xl lg:text-6xl">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-muted",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
