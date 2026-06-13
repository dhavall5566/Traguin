"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experienceShowcase, type ExperienceShowcaseItem } from "@/data/experienceShowcase";
import { getExperienceDetail } from "@/data/experienceDetails";
import { ExperienceDetailModal } from "@/components/experiences/ExperienceDetailModal";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";
import { cn } from "@/lib/utils";

function BentoNumber({ value }: { value: string }) {
  return (
    <p className="text-sm tracking-wide text-[var(--bento-number)]">
      <span className="opacity-70">#</span>
      {value}
    </p>
  );
}

function LearnMoreLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "experience-bento-card__learn inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-[var(--bento-title)] uppercase transition-colors duration-500 group-hover:text-gold",
        className
      )}
    >
      Explore Experience
      <ArrowUpRight size={14} aria-hidden />
    </span>
  );
}

function cardSurface(variant: ExperienceShowcaseItem["variant"], compact?: boolean) {
  return cn(
    "bento-card experience-bento-card group h-full w-full cursor-pointer overflow-hidden rounded-[1.75rem] text-left md:rounded-[2rem]",
    variant === "warm" ? "bento-card--warm" : "bento-card--light",
    compact && "experience-bento-card--compact"
  );
}

type BentoCardProps = {
  item: ExperienceShowcaseItem;
  onOpen: (slug: string) => void;
  hoveredId: string | null;
  rowIds: string[];
  onHover: (id: string | null) => void;
};

function WideSplitCard({ item, onOpen, hoveredId, rowIds, onHover }: BentoCardProps) {
  const imageFirst = item.layout === "wide-split-left";
  const compact = hoveredId !== null && hoveredId !== item.id && rowIds.includes(hoveredId);

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(item.id)}
      onBlur={() => onHover(null)}
      className={cn(cardSurface(item.variant, compact), "min-w-0 lg:min-h-[22rem]")}
      aria-haspopup="dialog"
    >
      <div className="grid h-full lg:grid-cols-2">
        <div
          className={cn(
            "experience-bento-card__copy flex min-h-[16rem] flex-col justify-center p-7 transition-[padding] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] sm:p-8 md:p-10 lg:min-h-0 lg:p-12",
            imageFirst && "lg:order-2",
            compact && "lg:px-6 lg:py-8"
          )}
        >
          <BentoNumber value={item.number} />
          <h3 className="experience-bento-card__title mt-4 font-display text-[clamp(1.5rem,2.8vw,2.35rem)] leading-[1.08] font-bold tracking-tight text-[var(--bento-title)] uppercase transition-[font-size] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]">
            {item.title}
          </h3>
          <p className="experience-bento-card__description mt-4 line-clamp-3 max-w-md text-sm leading-relaxed text-[var(--bento-body)] md:text-[15px]">
            {item.description}
          </p>
          <LearnMoreLabel className="mt-6" />
        </div>

        <div
          className={cn(
            "flex min-h-[14rem] items-stretch p-4 transition-[padding] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] sm:p-5 md:p-6 lg:min-h-0 lg:p-8",
            imageFirst && "lg:order-1",
            compact && "lg:p-4"
          )}
        >
          <div className="relative min-h-[12rem] w-full overflow-hidden rounded-[1.25rem] md:rounded-[1.35rem] lg:min-h-full">
            <SafeImage
              src={item.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function TallStackCard({ item, onOpen, hoveredId, rowIds, onHover }: BentoCardProps) {
  const compact = hoveredId !== null && hoveredId !== item.id && rowIds.includes(hoveredId);

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(item.id)}
      onBlur={() => onHover(null)}
      className={cn(
        cardSurface(item.variant, compact),
        "flex min-w-0 flex-col lg:min-h-[22rem]"
      )}
      aria-haspopup="dialog"
    >
      <div
        className={cn(
          "experience-bento-card__copy flex items-start justify-between gap-4 p-7 pb-4 transition-[padding] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] sm:p-8 sm:pb-5",
          compact && "p-5 pb-3 sm:p-6 sm:pb-4"
        )}
      >
        <div className="min-w-0">
          <BentoNumber value={item.number} />
          <h3 className="experience-bento-card__title mt-3 truncate font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.08] font-bold tracking-tight text-[var(--bento-title)] uppercase transition-[font-size] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]">
            {item.title}
          </h3>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--bento-border)] text-[var(--bento-title)] transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:border-gold/40 group-hover:text-gold",
            compact && "h-8 w-8"
          )}
        >
          <ArrowUpRight size={compact ? 14 : 18} aria-hidden />
        </span>
      </div>

      <div
        className={cn(
          "relative mx-4 mb-4 min-h-[14rem] flex-1 transition-[margin] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] sm:mx-5 sm:mb-5",
          compact && "mx-3 mb-3 min-h-[12rem] sm:mx-4 sm:mb-4"
        )}
      >
        <div className="relative h-full min-h-[inherit] overflow-hidden rounded-[1.25rem] md:rounded-[1.35rem]">
          <SafeImage
            src={item.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.02]"
          />
          {item.imageCaption && (
            <div className="experience-bento-card__caption absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/88 via-black/50 to-transparent px-5 pb-5 pt-14 sm:px-6 sm:pb-6">
              <p className="line-clamp-3 text-[10px] leading-relaxed font-medium tracking-[0.14em] text-white uppercase sm:text-[11px]">
                {item.imageCaption}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function BentoCard(props: BentoCardProps) {
  if (props.item.layout === "tall-stack") {
    return <TallStackCard {...props} />;
  }
  return <WideSplitCard {...props} />;
}

function ExperienceBentoRow({
  items,
  hoveredId,
  onHover,
  onOpen,
  widePosition,
}: {
  items: ExperienceShowcaseItem[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onOpen: (slug: string) => void;
  widePosition: "left" | "right";
}) {
  const rowIds = useMemo(() => items.map((item) => item.id), [items]);
  const hoverIndex = hoveredId ? rowIds.indexOf(hoveredId) : -1;
  const hoverInRow = hoverIndex >= 0;

  return (
    <div
      data-reveal-item
      className={cn(
        "experience-bento-row gap-4 [transform-style:preserve-3d] sm:gap-5 lg:gap-6",
        widePosition === "left" ? "experience-bento-row--wide-left" : "experience-bento-row--wide-right",
        hoverInRow && hoverIndex === 0 && "experience-bento-row--hover-first",
        hoverInRow && hoverIndex === 1 && "experience-bento-row--hover-second"
      )}
    >
      {items.map((item) => (
        <BentoCard
          key={item.id}
          item={item}
          onOpen={onOpen}
          hoveredId={hoveredId}
          rowIds={rowIds}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

export function ExperienceShowcase() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeExperience = activeSlug ? getExperienceDetail(activeSlug) : null;
  const bentoRef = useRef<HTMLDivElement>(null);
  useStaggerReveal3D(bentoRef, { variant: "left", stagger: 0.18 });

  const topRow = experienceShowcase.slice(0, 2);
  const bottomRow = experienceShowcase.slice(2, 4);

  return (
    <>
      <HomeSection
        id="experiences"
        tone="surface"
        className="bg-[var(--bento-section-bg)]"
      >
        <Reveal3D variant="up">
          <SectionHeader
            eyebrow="Signature Experiences"
            title="Beyond the Ordinary"
            description="Private journeys, corporate retreats, and curated group programs, each designed with the same white-glove attention to detail."
          />
        </Reveal3D>

        <div
          ref={bentoRef}
          className="mt-10 flex flex-col gap-4 [perspective:1600px] sm:gap-5 lg:mt-12 lg:gap-6"
        >
          <ExperienceBentoRow
            items={topRow}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onOpen={setActiveSlug}
            widePosition="left"
          />
          <ExperienceBentoRow
            items={bottomRow}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onOpen={setActiveSlug}
            widePosition="right"
          />
        </div>

        <Reveal3D variant="scale" delay={0.1}>
          <HomeSectionActions>
          <Link
            href="/contact#consultation"
            className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-gold px-8 py-4 text-xs font-bold tracking-[0.14em] text-on-gold uppercase shadow-lg shadow-gold/20 transition-colors hover:bg-gold-light"
          >
            Design Your Experience
            <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/travel-expert"
            className="inline-flex items-center gap-2 rounded-full border border-glass-border glass px-8 py-4 text-xs font-bold tracking-[0.14em] text-foreground uppercase transition-colors hover:border-gold/40"
          >
            Travel Expert Services
            <ArrowUpRight size={14} />
          </Link>
        </HomeSectionActions>
        </Reveal3D>
      </HomeSection>

      {activeExperience && (
        <ExperienceDetailModal
          experience={activeExperience}
          onClose={() => setActiveSlug(null)}
        />
      )}
    </>
  );
}
