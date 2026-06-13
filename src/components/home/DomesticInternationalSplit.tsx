"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { images } from "@/lib/images";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection } from "@/components/home/HomeSection";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { primaryCta } from "@/data/site";
import { cn } from "@/lib/utils";

const panels = [
  {
    id: "domestic",
    label: "Domestic",
    title: "India & Beyond",
    description: "Heritage circuits, Himalayan escapes, and coastal retreats across the subcontinent.",
    image: images.homeRegionDomestic,
    imageClass: "object-cover object-[center_40%] saturate-[1.08] group-hover:saturate-[1.18]",
    href: "/destinations?region=domestic",
    highlights: ["Kashmir & Ladakh", "Kerala Backwaters", "Goa & Rajasthan"],
    stat: "5 Regions",
    mood: "warm",
  },
  {
    id: "international",
    label: "International",
    title: "Worldwide Journeys",
    description: "Alpine lodges, island sanctuaries, and iconic cities curated with white-glove service.",
    image: images.homeRegionInternational,
    imageClass: "object-cover object-center saturate-[1.06] group-hover:saturate-[1.16]",
    href: "/destinations?region=international",
    highlights: ["Swiss Alps", "Maldives", "Japan & Bali"],
    stat: "10 Countries",
    mood: "cool",
  },
] as const;

export function DomesticInternationalSplit() {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <HomeSection id="explore-regions">
      <div ref={gridRef} className="home-grid md:grid-cols-2 [perspective:1400px]">
        {panels.map((panel, index) => (
          <Reveal3D key={panel.id} variant={index === 0 ? "left" : "right"} delay={index * 0.08}>
            <Tilt3DCard max={9} scale={1.015} className="overflow-hidden rounded-2xl">
              <article className="group relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-500 hover:border-gold/30 hover:shadow-[0_18px_44px_-14px_rgba(0,0,0,0.42)] sm:min-h-[440px]">
                <SafeImage
                  src={panel.image}
                  alt=""
                  className={cn(
                    "absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.06]",
                    panel.imageClass
                  )}
                />

                {/* Color mood — keeps photos vivid while anchoring text */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-50 mix-blend-soft-light",
                    panel.mood === "warm" &&
                      "bg-gradient-to-br from-amber-500/35 via-rose-900/10 to-orange-950/55",
                    panel.mood === "cool" &&
                      "bg-gradient-to-br from-emerald-400/25 via-teal-900/10 to-sky-950/50"
                  )}
                  aria-hidden
                />

                {/* Bottom-weighted scrim — photo stays bright above the fold */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/5"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10"
                  aria-hidden
                />

                <div className="relative z-10 mt-auto flex flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="inline-flex items-center rounded-full border border-white/35 bg-black/60 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-white uppercase shadow-[0_2px_12px_rgba(0,0,0,0.45)] backdrop-blur-md">
                      {panel.label}
                    </p>
                    <span className="rounded-full border border-white/25 bg-black/45 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
                      {panel.stat}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-3xl leading-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] md:text-4xl">
                    {panel.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                    {panel.description}
                  </p>
                  <ul
                    className="mt-4 flex flex-wrap gap-2"
                    aria-label={`Featured ${panel.label.toLowerCase()} destinations`}
                  >
                    {panel.highlights.map((place) => (
                      <li
                        key={place}
                        className="home-region-panel__chip rounded-full border border-white/25 bg-white/10 px-3 py-1 text-white/90 backdrop-blur-sm"
                      >
                        {place}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <MagneticButton
                      as="a"
                      href={panel.href}
                      variant="secondary"
                      className="home-region-panel__cta inline-flex items-center gap-2 !border-white/30 !bg-white/15 !text-white backdrop-blur-md hover:!border-gold/50 hover:!bg-white/22"
                    >
                      Explore {panel.label}
                      <ArrowUpRight size={14} />
                    </MagneticButton>
                  </div>
                </div>
              </article>
            </Tilt3DCard>
          </Reveal3D>
        ))}
      </div>
      <Reveal3D variant="scale" className="home-section-actions mt-8 flex justify-center lg:mt-10">
        <MagneticButton as="a" href={primaryCta.href} variant="primary">
          {primaryCta.label}
          <ArrowUpRight size={14} />
        </MagneticButton>
      </Reveal3D>
    </HomeSection>
  );
}
