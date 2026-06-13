"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 3000;

type HotelImageSliderProps = {
  images: string[];
  alt: string;
  className?: string;
  imageClassName?: string;
  intervalMs?: number;
  showIndicators?: boolean;
  indicatorsClassName?: string;
  pauseOnHover?: boolean;
};

export function HotelImageSlider({
  images,
  alt,
  className,
  imageClassName = "h-full w-full object-cover",
  intervalMs = SLIDE_INTERVAL_MS,
  showIndicators = true,
  indicatorsClassName,
  pauseOnHover = false,
}: HotelImageSliderProps) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [images.join("|")]);

  useEffect(() => {
    if (slides.length <= 1 || (pauseOnHover && paused)) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs, pauseOnHover, paused, images.join("|")]);

  if (slides.length === 0) return null;

  if (slides.length === 1) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <SafeImage src={slides[0]} alt={alt} className={imageClassName} />
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
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          )}
          aria-hidden={i !== index}
        >
          <SafeImage
            src={src}
            alt={`${alt}, photo ${i + 1} of ${slides.length}`}
            className={imageClassName}
          />
        </div>
      ))}

      {showIndicators && (
        <div
          className={cn(
            "absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5",
            indicatorsClassName
          )}
          role="tablist"
          aria-label="Gallery slides"
        >
          {slides.map((_, i) => (
            <span
              key={i}
              role="presentation"
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-gold" : "w-1.5 bg-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
