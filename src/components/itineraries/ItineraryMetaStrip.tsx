"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, MapPin, Star } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";

gsap.registerPlugin(ScrollTrigger);

type ItineraryMetaStripProps = {
  itinerary: Itinerary;
  rating: number;
  reviewCount: number;
};

export function ItineraryMetaStrip({ itinerary, rating, reviewCount }: ItineraryMetaStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const stars = Math.min(5, Math.max(0, Math.round(rating)));

  useGSAP(
    () => {
      const strip = stripRef.current;
      if (!strip) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        strip,
        { y: 48, rotateX: 22, opacity: 0, transformPerspective: 1100, transformOrigin: "center top" },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 92%",
            once: true,
          },
        }
      );

      const cells = strip.querySelectorAll("[data-meta-cell]");
      gsap.fromTo(
        cells,
        { y: 24, rotateY: -12, opacity: 0, transformPerspective: 900 },
        {
          y: 0,
          rotateY: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Journey details"
      className="itinerary-3d-stage relative z-20 -mt-10 page-x-padding md:-mt-14"
    >
      <div className="site-container">
        <div
          ref={stripRef}
          className="grid grid-cols-2 divide-x divide-y divide-glass-border overflow-hidden rounded-2xl border border-glass-border bg-surface/95 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur-xl [transform-style:preserve-3d] will-change-transform md:grid-cols-4 md:divide-y-0"
        >
          <MetaCell icon={Clock} label="Duration" value={itinerary.duration} />
          <MetaCell
            icon={MapPin}
            label="Destination"
            value={`${itinerary.destination} · ${itinerary.region === "domestic" ? "India" : "International"}`}
          />
          <MetaCell
            icon={Star}
            label="Guest rating"
            value={
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={11} className="fill-gold text-gold" aria-hidden />
                  ))}
                </span>
                <span>{rating.toFixed(1)}</span>
                <span className="text-sm font-normal text-muted">({reviewCount})</span>
              </span>
            }
          />
          <MetaCell
            label="Journey type"
            value={itinerary.featured ? "Signature itinerary" : "Curated journey"}
          />
        </div>
      </div>
    </section>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
}: {
  icon?: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: ReactNode;
}) {
  return (
    <div
      data-meta-cell
      className="flex gap-3 px-4 py-5 [transform-style:preserve-3d] sm:px-6 sm:py-6"
    >
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
          <Icon size={18} className="text-gold" aria-hidden />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.22em] text-muted uppercase">{label}</p>
        <p className="mt-1 font-medium leading-snug text-foreground">{value}</p>
      </div>
    </div>
  );
}
