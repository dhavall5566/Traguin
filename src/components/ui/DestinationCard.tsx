"use client";

import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getDestinationGalleryImages } from "@/lib/destination-images";
import { cn } from "@/lib/utils";

const DESTINATION_SLIDE_INTERVAL_MS = 4000;

type DestinationCardProps = {
  name: string;
  description: string;
  image: string;
  /** Resolves five destination photos for the card slider */
  destinationId: string;
  startingPrice?: number;
  href: string;
  cta?: string;
  duration?: string;
  /** Region or country shown under the title */
  location?: string;
  /** 1–5 star row; defaults to 5 for curated journeys */
  rating?: number;
  className?: string;
};

export function DestinationCard({
  name,
  description,
  image,
  destinationId,
  startingPrice,
  href,
  cta = "View Journey",
  duration,
  location,
  rating = 5,
  className,
}: DestinationCardProps) {
  const stars = Math.min(5, Math.max(0, Math.round(rating)));
  const galleryImages = getDestinationGalleryImages(destinationId, image);

  return (
    <Link
      href={href}
      className={cn(
        "destination-card group flex h-full flex-col overflow-hidden rounded-3xl border border-glass-border bg-surface transition-all duration-500",
        "hover:border-gold/35 hover:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.28)] hover:-translate-y-1",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <HotelImageSlider
          images={galleryImages}
          alt={name}
          className="h-full w-full"
          intervalMs={DESTINATION_SLIDE_INTERVAL_MS}
          showIndicators={false}
          pauseOnHover
        />
        {duration && (
          <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-surface/95 px-3 py-1 text-[10px] font-medium tracking-wide text-foreground uppercase shadow-sm backdrop-blur-sm">
            <Clock size={11} className="text-gold" aria-hidden />
            {duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {stars > 0 && (
          <div className="flex items-center gap-1.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} size={12} className="fill-gold text-gold" aria-hidden />
            ))}
            <span className="text-xs text-foreground">{rating.toFixed(1)}</span>
          </div>
        )}

        <h3 className="mt-2 font-display text-xl leading-snug text-foreground md:text-[1.35rem]">
          {name}
        </h3>

        {location && <p className="mt-0.5 text-sm text-muted">{location}</p>}

        <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-sand md:text-xs">
          {description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {startingPrice != null ? (
            <PriceDisplay amount={startingPrice} label="From" size="md" />
          ) : (
            <span />
          )}
          <span
            className={cn(
              "shrink-0 rounded-full border border-glass-border bg-surface px-4 py-2 text-xs font-medium tracking-wide text-foreground",
              "shadow-sm transition-colors group-hover:border-gold/40"
            )}
          >
            {cta}
          </span>
        </div>
      </div>
    </Link>
  );
}
