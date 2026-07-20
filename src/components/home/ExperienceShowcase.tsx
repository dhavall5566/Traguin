"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ExperienceShowcaseItem } from "@/lib/experience-types";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";
import { cn } from "@/lib/utils";

function ExperienceCard({
  item,
  className,
}: {
  item: ExperienceShowcaseItem;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "experience-showcase-card group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-glass-border bg-surface text-left",
        "shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)] transition-[border-color,box-shadow] duration-300",
        "hover:border-gold/30 hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.22)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className
      )}
    >
      <div className="relative aspect-[9/4] w-full overflow-hidden bg-[#f3efe8]">
        <SafeImage
          src={item.image}
          alt=""
          className={cn(
            "h-full w-full object-cover",
            item.id === "group-tours" ? "object-[50%_24%]" : "object-center",
          )}
        />
        <span className="experience-showcase-card__index absolute top-3 left-3 sm:top-4 sm:left-4">
          {item.number}
        </span>
      </div>

      <div className="flex flex-col p-4 sm:p-5">
        <h3 className="font-display text-lg leading-snug tracking-tight text-foreground text-balance sm:text-2xl">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted sm:line-clamp-2">
          {item.description}
        </p>
        <span className="experience-showcase-card__cta mt-3 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-gold uppercase sm:mt-4 sm:text-[11px]">
          Explore experience
          <ArrowUpRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ExperienceShowcase({
  items,
}: {
  items?: ExperienceShowcaseItem[];
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerReveal3D(gridRef, { variant: "up", stagger: 0.08 });

  if (!items || items.length === 0) return null;

  return (
    <HomeSection id="experiences">
      <Reveal3D variant="up">
        <SectionHeader
          eyebrow="Signature Experiences"
          title="Beyond the Ordinary"
          description="Private journeys, corporate retreats, and curated group programs, each designed with the same white-glove attention to detail."
          titleClassName="text-balance text-[clamp(2rem,7.5vw,3.75rem)] leading-[1.05] md:text-5xl lg:text-6xl"
        />
      </Reveal3D>

      <div
        ref={gridRef}
        className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:mt-12 lg:gap-6 sm:[perspective:1400px]"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-reveal-item
            className="flex min-w-0 sm:[transform-style:preserve-3d]"
          >
            <ExperienceCard item={item} />
          </div>
        ))}
      </div>

      <Reveal3D variant="scale" delay={0.08}>
        <HomeSectionActions className="!mt-8">
          <MagneticButton as="a" href="/contact#consultation" variant="primary">
            Design Your Experience
            <ArrowUpRight size={14} />
          </MagneticButton>
          <MagneticButton as="a" href="/travel-expert" variant="secondary">
            Travel Expert Services
            <ArrowUpRight size={14} />
          </MagneticButton>
        </HomeSectionActions>
      </Reveal3D>
    </HomeSection>
  );
}
