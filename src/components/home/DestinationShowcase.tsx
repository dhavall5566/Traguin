"use client";

import { useRef, useEffect, useState } from "react";
import { destinations } from "@/data/destinations";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

const SHOWCASE_INTERVAL_MS = 3000;

const showcaseDestinations = destinations.filter((d) =>
  ["bali", "dubai", "switzerland", "thailand", "vietnam", "singapore", "kerala", "kashmir"].includes(d.id)
);

export function DestinationShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const startTimer = () => {
      stopTimer();
      intervalId = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % showcaseDestinations.length);
      }, SHOWCASE_INTERVAL_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTimer();
        } else {
          stopTimer();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      stopTimer();
    };
  }, []);

  const active = showcaseDestinations[activeIndex];

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {showcaseDestinations.map((dest, i) => (
        <div
          key={dest.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === activeIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <SafeImage
            src={dest.image}
            alt={`${dest.name}, ${dest.country}`}
            className={cn(
              "destination-showcase-image h-full w-full object-cover transition-transform duration-[2000ms]",
              i === activeIndex ? "scale-100" : "scale-110"
            )}
          />
          <div className="destination-showcase-scrim-h absolute inset-0" />
          <div className="destination-showcase-scrim-v absolute inset-0" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center">
        <div className="section-padding w-full max-w-7xl">
          <div className="max-w-xl">
            <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">
              Destination {String(activeIndex + 1).padStart(2, "0")} / {String(showcaseDestinations.length).padStart(2, "0")}
            </p>
            <h2 className="font-display text-5xl text-foreground md:text-7xl">
              {active.name}
            </h2>
            <p
              className="mt-2 text-lg"
              style={{ color: "var(--showcase-subtitle)" }}
            >
              {active.country}
            </p>
            <p
              className="mt-6 leading-relaxed"
              style={{ color: "var(--showcase-body)" }}
            >
              {active.description}
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="font-display text-3xl text-gold">{active.packageCount}</p>
                <p
                  className="text-xs tracking-wide uppercase"
                  style={{ color: "var(--showcase-stat-label)" }}
                >
                  Packages
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-gold">{active.hotelCount}</p>
                <p
                  className="text-xs tracking-wide uppercase"
                  style={{ color: "var(--showcase-stat-label)" }}
                >
                  Hotels
                </p>
              </div>
            </div>
            <MagneticButton
              as="a"
              href={`/packages/${active.region}?destination=${active.id}`}
              variant="primary"
              className="mt-10 !px-8 !py-3.5"
            >
              Explore Packages
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {showcaseDestinations.map((dest, i) => (
          <div
            key={dest.id}
            className={cn(
              "h-12 w-1 rounded-full transition-all duration-500",
              i === activeIndex && "bg-gold h-16"
            )}
            style={
              i !== activeIndex
                ? { backgroundColor: "var(--showcase-progress-inactive)" }
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
