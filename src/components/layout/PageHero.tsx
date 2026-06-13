import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { PageHeroContent } from "@/data/pageContent";
import { cn } from "@/lib/utils";

type PageHeroProps = PageHeroContent & {
  variant?: "banner" | "editorial";
  className?: string;
};

export function PageHero({
  eyebrow,
  badge,
  title,
  description,
  image,
  imageAlt = "",
  primaryAction,
  secondaryAction,
  variant = "banner",
  className,
}: PageHeroProps) {
  if (variant === "banner" && image) {
    return (
      <section className={cn("page-hero page-hero--banner", className)}>
        <SafeImage src={image} alt={imageAlt} className="page-hero__image" loading="eager" />
        <div className="page-hero__scrim" aria-hidden />
        <div className="home-shell relative z-10">
          <div className="site-container page-hero__content">
            <PageHeroCopy
              eyebrow={eyebrow}
              badge={badge}
              title={title}
              description={description}
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              onDark
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <header className={cn("page-hero page-hero--editorial", className)}>
      <PageHeroCopy
        eyebrow={eyebrow}
        badge={badge}
        title={title}
        description={description}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
      />
    </header>
  );
}

function PageHeroCopy({
  eyebrow,
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  onDark = false,
}: Pick<
  PageHeroProps,
  "eyebrow" | "badge" | "title" | "description" | "primaryAction" | "secondaryAction"
> & { onDark?: boolean }) {
  return (
    <div className={cn("max-w-3xl", onDark && "text-white")}>
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={cn(
            "text-xs tracking-[0.28em] uppercase",
            onDark ? "text-gold-light" : "text-gold"
          )}
        >
          {eyebrow}
        </p>
        {badge && (
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10px] tracking-[0.16em] uppercase",
              onDark
                ? "border-white/25 bg-white/10 text-white/90 backdrop-blur-sm"
                : "border-gold/25 bg-gold/8 text-gold"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <h1
        className={cn(
          "mt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] tracking-tight",
          onDark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
          onDark ? "text-white/82" : "text-muted"
        )}
      >
        {description}
      </p>
      {(primaryAction || secondaryAction) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {primaryAction && (
            <MagneticButton
              as="a"
              href={primaryAction.href}
              variant="primary"
              className={cn("!text-xs", onDark && secondaryAction && "!shadow-lg")}
            >
              {primaryAction.label}
              <ArrowUpRight size={14} />
            </MagneticButton>
          )}
          {secondaryAction && (
            <MagneticButton
              as="a"
              href={secondaryAction.href}
              variant="secondary"
              className={cn(
                "!text-xs",
                onDark &&
                  "!border-white/30 !bg-white/10 !text-white backdrop-blur-sm hover:!border-gold/45 hover:!bg-white/15"
              )}
            >
              {secondaryAction.label}
            </MagneticButton>
          )}
        </div>
      )}
    </div>
  );
}

export function PageHeroLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-gold uppercase transition-colors hover:text-foreground"
    >
      {children}
      <ArrowUpRight size={14} />
    </Link>
  );
}
