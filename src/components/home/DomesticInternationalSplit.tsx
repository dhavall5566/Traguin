"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { HomeRegionPanel } from "@/lib/api/homepage";
import { cn, uniqueById } from "@/lib/utils";
import { useMotionLite } from "@/hooks/useMotionLite";

/** Named place photos for region chips. */
const NAMED_PLACE_IMAGES: Record<string, string> = {
  rajasthan: "/images/regions/rajasthan.jpg",
  kerala: "/images/regions/kerala.jpg",
  himalayas: "/images/regions/himalayas.jpg",
  himalaya: "/images/regions/himalayas.jpg",
  goa: "/images/regions/goa.jpg",
  thailand: "/images/regions/thailand.jpg",
  bali: "/images/regions/bali.jpg?v=2",
  singapore: "/images/regions/singapore.jpg?v=2",
  australia: "/images/regions/australia.jpg?v=2",
  canada: "/images/regions/canada.jpg?v=2",
};

type PlaceSlide = { name: string; image: string };

function placeKey(name: string): string {
  return name.trim().toLowerCase().replace(/^(the)\s+/, "");
}

function regionPlaceSlides(panel: HomeRegionPanel): PlaceSlide[] {
  const names = panel.highlights.map((name) => name.trim()).filter(Boolean);
  if (names.length === 0) {
    return [{ name: panel.label, image: panel.image }];
  }

  return names.map((name) => {
    const mapped = NAMED_PLACE_IMAGES[placeKey(name)];
    return { name, image: mapped || panel.image };
  });
}

function RegionImageGallery({
  slides,
  imageClass,
  alt,
  index,
  onIndexChange,
}: {
  slides: PlaceSlide[];
  imageClass?: string;
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const motionLite = useMotionLite();
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(index);
  indexRef.current = index;

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      onIndexChange(((next % slides.length) + slides.length) % slides.length);
    },
    [onIndexChange, slides.length]
  );

  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);

  useEffect(() => {
    if (motionLite || slides.length <= 1 || paused) return;
    const timer = window.setInterval(() => {
      onIndexChange((indexRef.current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [motionLite, slides.length, paused, onIndexChange]);

  if (slides.length === 0) return null;

  const activeIndex = motionLite ? 0 : index;
  const hasMultiple = slides.length > 1 && !motionLite;
  const visibleSlides = motionLite ? slides.slice(0, 1) : slides;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={`${alt} photo gallery`}
    >
      {visibleSlides.map((slide, i) => (
        <div
          key={`${slide.name}-${slide.image}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === activeIndex ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== activeIndex}
        >
          <SafeImage
            src={slide.image}
            alt={`${slide.name}, ${alt}`}
            className={cn("h-full w-full object-cover", imageClass)}
          />
        </div>
      ))}

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 left-3 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 right-3 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      ) : null}
    </div>
  );
}

export function DomesticInternationalSplit({ panels }: { panels: HomeRegionPanel[] }) {
  const motionLite = useMotionLite();
  const regionPanels = useMemo(() => uniqueById(panels), [panels]);
  const [active, setActive] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const activePanel = regionPanels[Math.min(active, Math.max(regionPanels.length - 1, 0))];
  const gallery = activePanel ? regionPlaceSlides(activePanel) : [];
  const hasGallerySlides = gallery.length > 1 && !motionLite;
  const galleryKey = gallery.map((slide) => `${slide.name}:${slide.image}`).join("|");

  useEffect(() => {
    setGalleryIndex(0);
  }, [activePanel?.id, galleryKey]);

  const goToSlide = useCallback(
    (next: number) => {
      if (gallery.length === 0) return;
      setGalleryIndex(((next % gallery.length) + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  if (regionPanels.length === 0 || !activePanel) return null;

  const PanelContent = motionLite ? "div" : motion.div;

  return (
    <HomeSection id="explore-regions">
      <SectionHeader
        eyebrow="Where To Next"
        title="Pick A Point On The Map"
        description="Choose a region to preview the journeys we design there, from the soul of India to passports full of stamps."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3 lg:mt-10">
        {regionPanels.map((panel, index) => {
          const isActive = index === active;
          return (
            <button
              key={`${panel.id}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
                isActive
                  ? "border-gold bg-gold text-on-gold shadow-lg shadow-gold/20"
                  : "border-glass-border bg-surface text-muted hover:border-gold/40 hover:text-foreground"
              )}
            >
              {panel.label}
            </button>
          );
        })}
      </div>

      <Reveal3D variant="up" className="mt-6 sm:mt-8">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-glass-border bg-[#0a0e14] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)]">
          <div className="relative min-h-[420px] sm:min-h-[460px] lg:min-h-[520px]">
            <RegionImageGallery
              key={`${activePanel.id}-gallery`}
              slides={gallery}
              imageClass={activePanel.imageClass}
              alt={`${activePanel.label} destinations`}
              index={galleryIndex}
              onIndexChange={setGalleryIndex}
            />

            <div
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/92 via-black/50 to-black/15"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-transparent"
              aria-hidden
            />

            <div className="pointer-events-none absolute inset-0 z-20">
              <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-md sm:top-6 sm:left-6">
                {activePanel.label}
                <span className="text-gold">{activePanel.stat}</span>
              </span>

              <span className="absolute top-5 right-5 font-display text-sm text-white/45 sm:top-6 sm:right-6">
                {String(active + 1).padStart(2, "0")}
                <span className="text-white/25"> / {String(regionPanels.length).padStart(2, "0")}</span>
              </span>
            </div>

            <PanelContent
              key={`${activePanel.id}-content`}
              {...(motionLite
                ? {}
                : {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] as const },
                  })}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pt-0 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12"
            >
              {hasGallerySlides ? (
                <div
                  className="pointer-events-auto mb-5 flex items-center gap-2"
                  role="tablist"
                  aria-label="Gallery slides"
                >
                  {gallery.map((slide, i) => (
                    <button
                      key={`${slide.name}-${i}`}
                      type="button"
                      onClick={() => goToSlide(i)}
                      role="tab"
                      aria-selected={i === galleryIndex}
                      aria-label={`Show ${slide.name}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === galleryIndex ? "w-6 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/70"
                      )}
                    />
                  ))}
                </div>
              ) : null}
              <h3 className="max-w-xl font-display text-3xl leading-[1.1] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl">
                {activePanel.title}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                {activePanel.description}
              </p>
              <ul
                className="mt-5 flex flex-wrap gap-2"
                aria-label={`Featured ${activePanel.label.toLowerCase()} destinations`}
              >
                {gallery.map((place, i) => {
                  const isActivePlace = i === galleryIndex;
                  return (
                    <li key={`${place.name}-${i}`}>
                      <button
                        type="button"
                        onClick={() => goToSlide(i)}
                        aria-pressed={isActivePlace}
                        className={cn(
                          "home-region-panel__chip pointer-events-auto rounded-full border px-3 py-1 backdrop-blur-sm transition-colors",
                          isActivePlace
                            ? "border-gold/80 bg-gold/25 text-white"
                            : "border-white/25 bg-white/10 text-white/90 hover:border-white/50 hover:bg-white/15"
                        )}
                      >
                        {place.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={activePanel.href}
                aria-label={`Explore ${activePanel.label} destinations`}
                className="home-region-panel__cta pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[11px] font-bold tracking-[0.14em] text-on-gold uppercase shadow-lg shadow-gold/20 transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore {activePanel.label}
                <ArrowUpRight size={14} />
              </Link>
            </PanelContent>
          </div>
        </div>
      </Reveal3D>
    </HomeSection>
  );
}
