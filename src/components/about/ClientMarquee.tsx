"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { aboutClientLogos } from "@/data/about-clients";

function MarqueeTrack() {
  const items = [...aboutClientLogos, ...aboutClientLogos];

  return (
    <div className="client-marquee-track flex w-max items-center gap-4 sm:gap-5 md:gap-6">
      {items.map((client, index) => (
        <div
          key={`${client.id}-${index}`}
          className="client-marquee-card flex h-[5.5rem] w-[11.75rem] shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-white px-5 py-3.5 shadow-[0_6px_20px_-14px_rgba(26,22,18,0.28)] sm:h-[6rem] sm:w-[12.5rem] md:h-[6.25rem] md:w-[13rem]"
        >
          <Image
            src={client.logoSrc}
            alt={`${client.name} logo`}
            width={200}
            height={76}
            className="block max-h-[3.5rem] w-auto max-w-full object-contain sm:max-h-[3.75rem]"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export function ClientMarquee() {
  if (aboutClientLogos.length === 0) return null;

  return (
    <section className="mt-14 md:mt-16" aria-label="Corporate client logos">
      <SectionHeader
        align="left"
        eyebrow="Trusted partners"
        title="Organizations that travel with TRAGUIN"
        description="Corporates and institutions across India and abroad who rely on us for curated journeys and seamless delivery."
        titleClassName="text-[clamp(1.35rem,3vw,2.25rem)]"
        className="mb-8 md:mb-10"
      />

      <div className="relative overflow-hidden rounded-3xl border border-glass-border bg-surface/40 py-6 sm:py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface/95 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface/95 to-transparent sm:w-20" />
        <MarqueeTrack />
      </div>
    </section>
  );
}
