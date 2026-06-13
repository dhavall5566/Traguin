import { cn } from "@/lib/utils";

type ItinerarySectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function ItinerarySectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: ItinerarySectionHeaderProps) {
  return (
    <header
      className={cn(
        "itinerary-section-header max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="text-xs tracking-[0.28em] text-gold uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] tracking-tight text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground/72 sm:text-base">{description}</p>
      ) : null}
    </header>
  );
}
