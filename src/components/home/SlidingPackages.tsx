"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Star } from "lucide-react";
import { packages } from "@/data/packages";
import type { TravelPackage } from "@/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { getPackageJourneyHref, getPackageReviewCount } from "@/lib/packages";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 4000;
const BG_TRANSITION_S = 1.4;
const CARD_TRANSITION_S = 0.85;
const CONTENT_STAGGER = 0.07;
const CARD_VANISH_S = 0.55;
const NEXT_CARD_COUNT = 2;
const CARD_GAP = 24;
const SLOT_STEP = 240 + CARD_GAP;

const showcasePackages = packages.filter((p) => p.featured);
const PACKAGE_COUNT = showcasePackages.length;

const easePremium = [0.33, 1, 0.68, 1] as const;
const bgTransition = { duration: BG_TRANSITION_S, ease: easePremium };
const cardTransition = { duration: CARD_TRANSITION_S, ease: easePremium };

function packageBlurb(pkg: TravelPackage) {
  return `${pkg.highlights.slice(0, 2).join(". ")}. Crafted for discerning travelers seeking ${pkg.mood[0] ?? "luxury"} experiences.`;
}

const cardVanishTransition = {
  duration: CARD_VANISH_S,
  ease: easePremium,
} as const;

/** Active + next N cards only — never show previous packages */
function getForwardSlots(activeIndex: number) {
  const total = 1 + NEXT_CARD_COUNT;
  return Array.from({ length: total }, (_, slot) => ({
    slot,
    pkgIndex: (activeIndex + slot) % PACKAGE_COUNT,
  }));
}

function getSlotMotion(slot: number, isActive: boolean) {
  return {
    scale: isActive ? 1 : 0.85,
    opacity: isActive ? 1 : Math.max(0.5, 0.72 - slot * 0.1),
    x: slot * SLOT_STEP,
    rotateY: slot === 0 ? 0 : -6,
    zIndex: 30 - slot,
  };
}

function ShowcaseBackground({
  activeIndex,
  parallax,
}: {
  activeIndex: number;
  parallax: { x: number; y: number };
}) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {showcasePackages.map((pkg, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.div
            key={pkg.id}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1.14 : 1,
              x: isActive ? parallax.x : 0,
              y: isActive ? parallax.y : 0,
            }}
            transition={bgTransition}
          >
            <SafeImage
              src={pkg.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function ShowcaseContent({ pkg }: { pkg: TravelPackage }) {
  const journeyHref = getPackageJourneyHref(pkg);
  const reviewCount = getPackageReviewCount(pkg);
  const stars = Math.min(5, Math.max(0, Math.round(pkg.rating)));
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.12 + i * CONTENT_STAGGER,
        duration: 0.55,
        ease: easePremium,
      },
    }),
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.32, ease: easePremium },
    },
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: CONTENT_STAGGER, delayChildren: 0.1 },
    },
    exit: {
      transition: { staggerChildren: 0.04, staggerDirection: -1 },
    },
  };

  return (
    <motion.div
      key={pkg.id}
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="max-w-xl"
    >
      <motion.p
        custom={0}
        variants={item}
        className="text-sm tracking-[0.25em] text-white/80 uppercase md:text-base"
      >
        {pkg.destination}
        <span className="text-white/50">
          {" "}
          — {pkg.region === "domestic" ? "India" : "International"}
        </span>
      </motion.p>

      <motion.h2
        custom={1}
        variants={item}
        className="mt-3 font-display text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {pkg.title}
      </motion.h2>

      <motion.div
        custom={2}
        variants={item}
        className="mt-4 flex flex-wrap items-center gap-1.5"
        aria-label={`${pkg.rating.toFixed(1)} out of 5 from ${reviewCount} guest reviews`}
      >
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} size={14} className="fill-gold text-gold" aria-hidden />
        ))}
        <span className="text-sm font-medium text-white">{pkg.rating.toFixed(1)}</span>
        <span className="text-sm text-white/65">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      </motion.div>

      <motion.div
        custom={3}
        variants={item}
        className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75"
      >
        <span className="flex items-center gap-2">
          <Clock size={16} className="text-gold" />
          {pkg.duration}
        </span>
      </motion.div>

      <motion.p
        custom={4}
        variants={item}
        className="mt-5 max-w-md text-sm leading-relaxed text-white/75 md:text-base"
      >
        {packageBlurb(pkg)}
      </motion.p>

      <motion.ul custom={5} variants={item} className="mt-5 space-y-2">
        {pkg.highlights.slice(0, 3).map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-sm text-white/80"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {highlight}
          </li>
        ))}
      </motion.ul>

      <motion.div custom={6} variants={item} className="mt-6">
        <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
          From
        </p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-gold md:text-3xl">
          {formatPrice(pkg.price)}
        </p>
      </motion.div>

      <motion.div custom={7} variants={item} className="mt-8 flex flex-wrap items-center gap-4">
        <MagneticButton
          as="a"
          href={journeyHref}
          variant="primary"
          className="!px-8 !py-3.5"
        >
          <MapPin size={16} />
          Discover Journey
        </MagneticButton>
      </motion.div>
    </motion.div>
  );
}

function PackageCard({
  pkg,
  isActive,
  onSelect,
  className,
}: {
  pkg: TravelPackage;
  isActive: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative block h-full w-full overflow-hidden rounded-3xl border text-left [transform:translateZ(0)]",
        "transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
        isActive
          ? "border-gold/80 shadow-[0_28px_70px_-12px_rgba(212,175,55,0.45)]"
          : "border-white/20 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] hover:border-white/40",
        className
      )}
      aria-label={`Show ${pkg.title}`}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <SafeImage src={pkg.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-[10px] tracking-[0.18em] text-white/75 uppercase sm:text-xs">
          {pkg.destination}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs font-normal leading-snug text-white sm:text-sm">
          {pkg.title}
        </p>
      </div>
    </button>
  );
}

function DesktopCardStage({
  activeIndex,
  onSelect,
  onPauseChange,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  onPauseChange: (paused: boolean) => void;
}) {
  const slots = getForwardSlots(activeIndex);
  const trackWidth = SLOT_STEP * (1 + NEXT_CARD_COUNT) + 16;

  return (
    <div
      className="relative hidden h-[min(72vh,480px)] w-full items-center justify-center lg:flex"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => onPauseChange(true)}
      onMouseLeave={() => onPauseChange(false)}
    >
      <div
        className="relative h-[380px] overflow-visible"
        style={{ width: `min(100%, ${trackWidth}px)` }}
      >
        <div className="relative h-[360px] w-full overflow-visible">
          <AnimatePresence initial={false} mode="popLayout">
            {slots.map(({ slot, pkgIndex }) => {
              const pkg = showcasePackages[pkgIndex];
              const isActive = slot === 0;
              const motionState = getSlotMotion(slot, isActive);

              return (
                <motion.div
                  key={pkg.id}
                  className="absolute top-0 left-0 h-[360px] w-[240px] overflow-hidden rounded-3xl will-change-transform"
                  initial={slot > 0 ? { opacity: 0, x: motionState.x + 24 } : false}
                  animate={motionState}
                  exit={
                    slot === 0
                      ? {
                          opacity: 0,
                          scale: 0.9,
                          transition: cardVanishTransition,
                        }
                      : { opacity: 0, transition: { duration: 0.35 } }
                  }
                  transition={{
                    ...cardTransition,
                    opacity: cardTransition,
                    x: cardTransition,
                    scale: cardTransition,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: motionState.zIndex,
                  }}
                >
                  <PackageCard
                    pkg={pkg}
                    isActive={isActive}
                    onSelect={() => onSelect(pkgIndex)}
                    className="h-full w-full"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MobileCardStrip({
  activeIndex,
  onSelect,
  onPauseChange,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  onPauseChange: (paused: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const el = scrollRef.current;
    if (!el?.children[index]) return;
    const child = el.children[index] as HTMLElement;
    const left = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    if (isScrollingRef.current) return;
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const childCenter = node.offsetLeft + node.offsetWidth / 2;
      const dist = Math.abs(center - childCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    if (closest !== activeIndex) {
      isScrollingRef.current = true;
      onSelect(closest);
      window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    }
  }, [activeIndex, onSelect]);

  return (
    <div
      className="w-full lg:hidden"
      onTouchStart={() => onPauseChange(true)}
      onTouchEnd={() => onPauseChange(false)}
      onMouseEnter={() => onPauseChange(true)}
      onMouseLeave={() => onPauseChange(false)}
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[7.5vw] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
      >
        {showcasePackages.map((pkg, i) => (
          <div
            key={pkg.id}
            className="w-[85vw] max-w-[300px] shrink-0 snap-center"
          >
            <motion.div
              animate={{
                scale: i === activeIndex ? 1 : 0.92,
                opacity: i === activeIndex ? 1 : 0.65,
              }}
              transition={cardTransition}
              className="h-[320px] sm:h-[360px]"
            >
              <PackageCard
                pkg={pkg}
                isActive={i === activeIndex}
                onSelect={() => onSelect(i)}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselControls({
  onPrev,
  onNext,
  onPauseChange,
}: {
  onPrev: () => void;
  onNext: () => void;
  onPauseChange: (paused: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-center gap-3"
      onMouseEnter={() => onPauseChange(true)}
      onMouseLeave={() => onPauseChange(false)}
    >
      <button
        type="button"
        onClick={onPrev}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-gold/50"
        aria-label="Previous package"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-gold/50"
        aria-label="Next package"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export function SlidingPackages() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const active = showcasePackages[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % PACKAGE_COUNT) + PACKAGE_COUNT) % PACKAGE_COUNT);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % PACKAGE_COUNT);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + PACKAGE_COUNT) % PACKAGE_COUNT);
  }, []);

  const setPausedWithInteraction = useCallback((value: boolean) => {
    setPaused(value);
  }, []);

  useEffect(() => {
    if (paused || PACKAGE_COUNT <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % PACKAGE_COUNT);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const handleParallax = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setParallax({ x, y });
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-background"
      aria-label="Curated travel packages showcase"
      aria-live="polite"
      onMouseMove={handleParallax}
      onMouseLeave={() => setParallax({ x: 0, y: 0 })}
    >
      <h1 className="sr-only">TRAGUIN — Extraordinary luxury journeys crafted for you</h1>
      <div className="absolute inset-0">
        <ShowcaseBackground activeIndex={activeIndex} parallax={parallax} />
        <div className="sliding-packages-scrim-h absolute inset-0 z-[1]" />
        <div className="sliding-packages-scrim-v absolute inset-0 z-[1]" />
        <div className="sliding-packages-overlay absolute inset-0 z-[1]" />
      </div>

      <div className="relative z-20 flex h-full flex-col pt-[var(--site-header-height)]">
        <div className="flex flex-1 flex-col justify-center lg:flex-row lg:items-center">
          <div className="section-padding w-full shrink-0 lg:w-[48%] lg:max-w-2xl">
            <AnimatePresence mode="wait">
              {active && <ShowcaseContent key={active.id} pkg={active} />}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-8 lg:mt-0 lg:w-[52%] lg:px-6 lg:pb-0">
            <DesktopCardStage
              activeIndex={activeIndex}
              onSelect={goTo}
              onPauseChange={setPausedWithInteraction}
            />
            <div className="hidden w-full max-w-[820px] justify-center lg:flex">
              <CarouselControls
                onPrev={prev}
                onNext={next}
                onPauseChange={setPausedWithInteraction}
              />
            </div>

            <MobileCardStrip
              activeIndex={activeIndex}
              onSelect={goTo}
              onPauseChange={setPausedWithInteraction}
            />
            <div className="flex w-full justify-center lg:hidden">
              <CarouselControls
                onPrev={prev}
                onNext={next}
                onPauseChange={setPausedWithInteraction}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:flex">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="animate-bounce" size={18} />
        </div>
      </div>
    </section>
  );
}
