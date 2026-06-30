"use client";

import { HomeSection } from "@/components/home/HomeSection";
import { traguinStandardHighlights } from "@/data/pageContent";

export function LuxuryStatsBar() {
  return (
    <HomeSection
      spacing="compact"
      tone="muted"
      className="relative border-y border-glass-border"
      aria-label="TRAGUIN at a glance"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      <div className="mb-6 text-center">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-gold uppercase sm:text-[11px]">
          The TRAGUIN Standard
        </p>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Bespoke itineraries, handpicked stays, and one dedicated expert from first call to homecoming.
        </p>
      </div>
      <div className="grid grid-cols-1 divide-y divide-glass-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {traguinStandardHighlights.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center gap-2 px-4 py-5 text-center sm:px-6 sm:py-6"
          >
            <span
              className="traguin-standard__emoji"
              aria-hidden
            >
              {item.emoji}
            </span>
            <p className="max-w-[14rem] text-sm font-semibold leading-snug text-foreground sm:max-w-[16rem] sm:text-[0.95rem]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
