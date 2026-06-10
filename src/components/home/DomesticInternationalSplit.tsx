"use client";

import { ArrowUpRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { images } from "@/lib/images";
import { MagneticButton } from "@/components/ui/MagneticButton";

const panels = [
  {
    id: "domestic",
    label: "Domestic",
    title: "India & Beyond",
    description: "Heritage circuits, Himalayan escapes, and coastal retreats across the subcontinent.",
    image: images.kerala,
    href: "/destinations?region=domestic",
  },
  {
    id: "international",
    label: "International",
    title: "Worldwide Journeys",
    description: "Alpine lodges, island sanctuaries, and iconic cities curated with white-glove service.",
    image: images.switzerland,
    href: "/destinations?region=international",
  },
] as const;

export function DomesticInternationalSplit() {
  return (
    <section className="relative w-full scroll-mt-[var(--site-header-height)] px-[clamp(1.5rem,5vw,4rem)] pt-[clamp(1.5rem,4vw,2.5rem)] pb-[clamp(1rem,2.5vw,1.75rem)]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6">
        {panels.map((panel) => (
          <article
            key={panel.id}
            className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl border border-glass-border sm:min-h-[400px] md:min-h-[440px]"
          >
            <SafeImage
              src={panel.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,8,0.92)] via-[rgba(8,8,8,0.52)] to-[rgba(8,8,8,0.08)]" />

            <div className="relative z-10 mt-auto flex flex-col p-6 sm:p-8">
              <p className="text-xs tracking-[0.28em] text-gold uppercase">{panel.label}</p>
              <h2 className="mt-2 min-h-[2.75rem] font-display text-3xl leading-tight text-white md:min-h-[3.25rem] md:text-4xl">
                {panel.title}
              </h2>
              <p className="mt-3 min-h-[2.75rem] max-w-md text-sm leading-relaxed text-white/72 sm:min-h-[3rem]">
                {panel.description}
              </p>
              <div className="mt-6">
                <MagneticButton
                  as="a"
                  href={panel.href}
                  variant="secondary"
                  className="inline-flex items-center gap-2 !border-white/25 !bg-white/10 !text-white !text-xs backdrop-blur-sm hover:!border-gold/45 hover:!bg-white/15"
                >
                  Explore {panel.label}
                  <ArrowUpRight size={14} />
                </MagneticButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
