"use client";

import { useRef, type ComponentType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, MapPin, Sparkles, Star } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";

gsap.registerPlugin(ScrollTrigger);

type ItineraryMetaStripProps = {
  itinerary: Itinerary;
  rating: number;
  reviewCount: number;
};

export function ItineraryMetaStrip({ itinerary, rating, reviewCount }: ItineraryMetaStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const stars = Math.min(5, Math.max(0, Math.round(rating)));

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const cards = grid.querySelectorAll("[data-meta-card]");
      gsap.fromTo(
        cards,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 92%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const regionLabel = itinerary.region === "domestic" ? "India" : "International";

  return (
    <section
      ref={sectionRef}
      aria-label="Journey details"
      className="relative z-20 -mt-8 page-x-padding md:-mt-12"
    >
      <div className="site-container">
        <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <MetaCard icon={Clock} label="Duration" value={itinerary.duration} />
          <MetaCard
            icon={MapPin}
            label="Destination"
            value={`${itinerary.destination} · ${regionLabel}`}
          />
          <MetaCard
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
          <MetaCard
            icon={Sparkles}
            label="Journey type"
            value={itinerary.featured ? "Signature itinerary" : "Curated journey"}
          />
        </div>
      </div>
    </section>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: ReactNode;
}) {
  return (
    <div data-meta-card className="itinerary-meta-card">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
        <Icon size={16} className="text-gold" aria-hidden />
      </div>
      <p className="mt-4 text-[10px] tracking-[0.22em] text-muted uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium leading-snug text-foreground sm:text-[0.9375rem]">{value}</p>
    </div>
  );
}
