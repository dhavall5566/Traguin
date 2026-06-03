"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";

type ItineraryCardProps = {
  itinerary: Itinerary;
  cta?: string;
  className?: string;
  compact?: boolean;
};

export function ItineraryCard({
  itinerary,
  cta = "View Itinerary",
  className,
  compact = false,
}: ItineraryCardProps) {
  const href = `/destinations/${itinerary.destinationId}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-glass-border bg-surface transition-all duration-500 hover:border-gold/40 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className={cn("relative overflow-hidden", compact ? "aspect-[16/10]" : "aspect-[4/3]")}>
        <SafeImage
          src={itinerary.heroImage}
          alt={itinerary.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] tracking-wide text-foreground uppercase">
            <Clock size={12} className="text-gold" />
            {itinerary.duration}
          </span>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col", compact ? "p-5" : "p-6")}>
        <p className="text-xs tracking-wide text-gold uppercase">{itinerary.destination}</p>
        <h3 className="mt-1 font-display text-xl text-foreground md:text-2xl">{itinerary.title}</h3>
        {!compact && (
          <ul className="mt-3 space-y-1.5">
            {itinerary.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4 flex items-end justify-between gap-4">
          <PriceDisplay amount={itinerary.startingPrice} size="sm" />
          <span className="inline-flex shrink-0 items-center gap-1 text-xs tracking-[0.15em] text-gold uppercase">
            {cta}
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
