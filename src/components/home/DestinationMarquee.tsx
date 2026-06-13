"use client";

import { destinations } from "@/data/destinations";

const marqueeItems = destinations.map((d) => d.name);

function MarqueeTrack() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="destination-marquee-track flex w-max items-center gap-8 sm:gap-12">
      {items.map((name, i) => (
        <span key={`${name}-${i}`} className="inline-flex shrink-0 items-center gap-8 sm:gap-12">
          <span className="font-display text-[clamp(1.25rem,3vw,1.75rem)] tracking-[0.12em] text-foreground/75 uppercase">
            {name}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" aria-hidden />
        </span>
      ))}
    </div>
  );
}

export function DestinationMarquee() {
  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-b border-glass-border py-[clamp(1.25rem,3vw,1.75rem)]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <MarqueeTrack />
    </section>
  );
}
