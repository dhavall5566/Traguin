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
import { primaryCta } from "@/data/site";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 4000;
const BG_TRANSITION_S = 1.4;
const CARD_TRANSITION_S = 0.85;
const CONTENT_STAGGER = 0.07;
const CARD_VANISH_S = 0.55;
const NEXT_CARD_COUNT = 2;
const CARD_GAP = 26;
const CARD_WIDTH_MAX = 300;
const CARD_WIDTH_MIN = 190;
const CARD_HEIGHT_RATIO = 4 / 3; // height = width * 4/3 (3:4 portrait)

const showcasePackages = packages.filter((p) => p.featured);
const PACKAGE_COUNT = showcasePackages.length;

function getCardLayout(containerWidth: number) {
  const slots = 1 + NEXT_CARD_COUNT;
  const trackPadding = 8;
  const fitWidth = Math.floor(
    (containerWidth - trackPadding - CARD_GAP * slots) / slots
  );
  const cardWidth = Math.min(
    CARD_WIDTH_MAX,
    Math.max(CARD_WIDTH_MIN, fitWidth || CARD_WIDTH_MIN)
  );
  const slotStep = cardWidth + CARD_GAP;
  const cardHeight = Math.round(cardWidth * CARD_HEIGHT_RATIO);
  const trackWidth = slotStep * slots + trackPadding;

  return { cardWidth, cardHeight, slotStep, trackWidth };
}

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

/** Active + next N cards only, never show previous packages */
function getForwardSlots(activeIndex: number) {
  const total = 1 + NEXT_CARD_COUNT;
  return Array.from({ length: total }, (_, slot) => ({
    slot,
    pkgIndex: (activeIndex + slot) % PACKAGE_COUNT,
  }));
}

function getSlotMotion(slot: number, isActive: boolean, slotStep: number) {
  return {
    scale: isActive ? 1 : 0.85,
    opacity: isActive ? 1 : Math.max(0.5, 0.72 - slot * 0.1),
    x: slot * slotStep,
    rotateY: slot === 0 ? 0 : -8 - slot * 2,
    z: isActive ? 40 : -slot * 20,
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
              className="h-full min-h-full w-full object-cover object-center"
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
      className="max-w-xl lg:max-w-[34rem]"
    >
      <motion.p
        custom={0}
        variants={item}
        className="inline-block max-w-full text-sm font-semibold tracking-[0.2em] text-white/80 uppercase sm:tracking-[0.22em] md:text-base md:tracking-[0.24em]"
      >
        {pkg.destination}
        <span className="text-white/50">
          {" · "}
          {pkg.region === "domestic" ? "India" : "International"}
        </span>
      </motion.p>

      <motion.h2
        custom={1}
        variants={item}
        className="mt-2 font-display text-4xl leading-[1.08] text-balance text-white sm:mt-3 sm:text-5xl md:text-6xl lg:text-[2.35rem] lg:leading-[1.1] xl:text-5xl"
      >
        {pkg.title}
      </motion.h2>

      <motion.div
        custom={2}
        variants={item}
        className="mt-3 flex flex-wrap items-center gap-1.5 lg:mt-2.5"
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
        className="mt-2.5 flex flex-wrap items-center gap-4 text-sm text-white/75 lg:mt-2"
      >
        <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
          <Clock size={16} className="text-gold" />
          {pkg.duration}
        </span>
      </motion.div>

      <motion.p
        custom={4}
        variants={item}
        className="mt-4 max-w-md text-sm leading-relaxed text-white/75 md:text-base lg:hidden"
      >
        {packageBlurb(pkg)}
      </motion.p>

      <motion.ul custom={5} variants={item} className="mt-4 space-y-1.5 lg:mt-3 lg:space-y-1">
        {pkg.highlights.slice(0, 3).map((highlight, index) => (
          <li
            key={highlight}
            className={cn(
              "flex items-start gap-2 text-sm text-white/80",
              index === 2 && "lg:hidden"
            )}
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {highlight}
          </li>
        ))}
      </motion.ul>

      <motion.div custom={6} variants={item} className="mt-4 lg:mt-3">
        <p className="text-[10px] font-bold tracking-[0.22em] text-white/60 uppercase">
          From
        </p>
        <p className="mt-0.5 text-xl font-bold tracking-tight text-gold md:text-2xl lg:text-xl xl:text-2xl">
          {formatPrice(pkg.price)}
        </p>
      </motion.div>

      <motion.div custom={7} variants={item} className="mt-5 flex flex-wrap items-center gap-3 lg:mt-4">
        <MagneticButton
          as="a"
          href={journeyHref}
          variant="primary"
          className="!px-8 !py-3.5 !text-xs !font-bold !tracking-[0.14em] !uppercase"
        >
          <MapPin size={16} />
          Discover Journey
        </MagneticButton>
        <MagneticButton
          as="a"
          href={primaryCta.href}
          variant="secondary"
          className="!border-white/25 !bg-white/10 !px-6 !py-3.5 !text-xs !font-bold !tracking-[0.14em] !text-white !uppercase backdrop-blur-sm hover:!border-gold/45 hover:!bg-white/15"
        >
          {primaryCta.label}
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
        "relative block h-full w-full overflow-hidden rounded-2xl text-left [transform:translateZ(0)]",
        "border transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
        isActive
          ? "border-gold/50 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)]"
          : "border-white/12 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.42)] hover:border-white/25 hover:shadow-[0_14px_34px_-12px_rgba(0,0,0,0.48)]",
        className
      )}
      aria-label={`Show ${pkg.title}`}
      aria-current={isActive ? "true" : undefined}
    >
      <SafeImage
        src={pkg.image}
        alt=""
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/40 px-4 py-3.5 backdrop-blur-sm sm:px-4 sm:py-4">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase sm:text-[11px] sm:tracking-[0.2em]">
          {pkg.destination}
          <span className="text-white/45">
            {" · "}
            {pkg.region === "domestic" ? "India" : "International"}
          </span>
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-white">
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardLayout, setCardLayout] = useState(() => getCardLayout(808));
  const slots = getForwardSlots(activeIndex);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateLayout = () => {
      setCardLayout(getCardLayout(el.clientWidth));
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { cardWidth, cardHeight, slotStep, trackWidth } = cardLayout;

  return (
    <div
      ref={containerRef}
      className="relative hidden w-full min-w-0 items-center justify-center lg:flex"
      style={{ height: cardHeight, perspective: "1400px" }}
      onMouseEnter={() => onPauseChange(true)}
      onMouseLeave={() => onPauseChange(false)}
    >
      <div className="relative mx-auto" style={{ width: trackWidth, height: cardHeight }}>
        <AnimatePresence initial={false} mode="popLayout">
          {slots.map(({ slot, pkgIndex }) => {
            const pkg = showcasePackages[pkgIndex];
            const isActive = slot === 0;
            const motionState = getSlotMotion(slot, isActive, slotStep);

            return (
              <motion.div
                key={pkg.id}
                className="absolute top-0 left-0 overflow-hidden rounded-2xl will-change-transform"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  transformStyle: "preserve-3d",
                  zIndex: motionState.zIndex,
                }}
                transition={{
                  ...cardTransition,
                  opacity: cardTransition,
                  x: cardTransition,
                  scale: cardTransition,
                }}
                animate={motionState}
                initial={slot > 0 ? { opacity: 0, x: motionState.x + 24 } : false}
                exit={
                  slot === 0
                    ? {
                        opacity: 0,
                        scale: 0.9,
                        transition: cardVanishTransition,
                      }
                    : { opacity: 0, transition: { duration: 0.35 } }
                }
              >
                <PackageCard
                  pkg={pkg}
                  isActive={isActive}
                  onSelect={() => onSelect(pkgIndex)}
                  className="size-full"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
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
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[var(--layout-gutter-x)] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
      >
        {showcasePackages.map((pkg, i) => (
          <div
            key={pkg.id}
            className="aspect-[3/4] w-[min(82vw,280px)] shrink-0 snap-center"
          >
            <motion.div
              animate={{
                scale: i === activeIndex ? 1 : 0.92,
                opacity: i === activeIndex ? 1 : 0.65,
              }}
              transition={cardTransition}
              className="size-full"
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
      className="relative min-h-[100svh] w-full overflow-x-hidden bg-background"
      aria-label="Curated travel packages showcase"
      aria-live="polite"
      onMouseMove={handleParallax}
      onMouseLeave={() => setParallax({ x: 0, y: 0 })}
    >
      <h1 className="sr-only">TRAGUIN: extraordinary luxury journeys crafted for you</h1>
      <div className="absolute inset-0 overflow-hidden">
        <ShowcaseBackground activeIndex={activeIndex} parallax={parallax} />
        <div className="sliding-packages-scrim-h absolute inset-0 z-[1]" />
        <div className="sliding-packages-scrim-v absolute inset-0 z-[1]" />
        <div className="sliding-packages-overlay absolute inset-0 z-[1]" />
      </div>

      <div className="relative z-20 flex min-h-[calc(100svh-var(--site-header-height))] flex-col pt-[var(--site-header-height)] pb-8 sm:pb-10 lg:pb-12">
        <div className="home-shell flex flex-1 flex-col">
          <div className="site-container flex flex-1 flex-col justify-center gap-6 py-5 sm:py-6 lg:flex-row lg:items-center lg:gap-8 lg:py-8 xl:gap-10">
          <div className="w-full min-w-0 shrink lg:w-[42%] xl:w-[min(40%,34rem)]">
            <AnimatePresence mode="wait">
              {active && <ShowcaseContent key={active.id} pkg={active} />}
            </AnimatePresence>
          </div>

          <div className="flex w-full min-w-0 flex-col items-center justify-center gap-4 sm:gap-5 lg:w-[58%] lg:gap-5 xl:w-[60%]">
            <DesktopCardStage
              activeIndex={activeIndex}
              onSelect={goTo}
              onPauseChange={setPausedWithInteraction}
            />
            <div className="hidden w-full max-w-[940px] justify-center lg:flex">
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
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 lg:flex xl:bottom-6">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="animate-bounce" size={18} />
        </div>
      </div>
    </section>
  );
}
