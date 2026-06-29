"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import { useMotionLite } from "@/hooks/useMotionLite";

const SLIDE_INTERVAL_MS = 3000;

type HotelImageSliderProps = {
  images: string[];
  alt: string;
  className?: string;
  imageClassName?: string;
  intervalMs?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  indicatorsClassName?: string;
  arrowsClassName?: string;
  pauseOnHover?: boolean;
};

export function HotelImageSlider({
  images,
  alt,
  className,
  imageClassName = "h-full w-full object-cover",
  intervalMs = SLIDE_INTERVAL_MS,
  showIndicators = true,
  showArrows = false,
  indicatorsClassName,
  arrowsClassName,
  pauseOnHover = false,
}: HotelImageSliderProps) {
  const motionLite = useMotionLite();
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    setIndex(0);
  }, [images.join("|")]);

  useEffect(() => {
    if (motionLite || slides.length <= 1 || (pauseOnHover && paused)) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [motionLite, slides.length, intervalMs, pauseOnHover, paused, images.join("|")]);

  if (slides.length === 0) return null;

  const displayIndex = motionLite ? 0 : index;

  if (slides.length === 1 || motionLite) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <SafeImage src={slides[0]} alt={alt} className={imageClassName} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      aria-roledescription="carousel"
      aria-label={`${alt} photo gallery`}
    >
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === displayIndex ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== displayIndex}
        >
          <SafeImage
            src={src}
            alt={`${alt}, photo ${i + 1} of ${slides.length}`}
            className={imageClassName}
          />
        </div>
      ))}

      {showArrows ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className={cn(
              "absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:left-4",
              arrowsClassName
            )}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className={cn(
              "absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-gold/50 hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:right-4",
              arrowsClassName
            )}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      ) : null}

      {showIndicators ? (
        <div
          className={cn(
            "absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5",
            indicatorsClassName
          )}
          role="tablist"
          aria-label="Gallery slides"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === displayIndex}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === displayIndex ? "w-5 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
