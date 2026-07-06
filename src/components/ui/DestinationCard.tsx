"use client";

import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getDestinationGalleryImages } from "@/lib/destination-images";
import { getDestinationRating, getDestinationReviewCount } from "@/lib/destinations";
import { useTilt3D } from "@/hooks/useTilt3D";
import { cn } from "@/lib/utils";

const DESTINATION_SLIDE_INTERVAL_MS = 4000;

type DestinationCardProps = {
  name: string;
  description: string;
  image: string;
  /** Resolves five destination photos for the card slider */
  destinationId: string;
  galleryImages?: string[];
  startingPrice?: number;
  href: string;
  cta?: string;
  duration?: string;
  /** Region or country shown under the title */
  location?: string;
  /** 1–5 star row; defaults to itinerary/destination rating when omitted */
  rating?: number;
  /** Guest review count; derived from destination when omitted */
  reviewCount?: number;
  /** Region label, e.g. India or International */
  regionLabel?: string;
  className?: string;
  /** Enable mouse-tilt 3D effect on desktop */
  tilt?: boolean;
};

export function DestinationCard({
  name,
  description,
  image,
  destinationId,
  galleryImages,
  startingPrice,
  href,
  cta = "View Journey",
  duration,
  location,
  rating,
  reviewCount,
  regionLabel,
  className,
  tilt = false,
}: DestinationCardProps) {
  const tiltRef = useTilt3D<HTMLAnchorElement>({ max: 11, scale: 1.02 });
  const displayRating = rating ?? getDestinationRating(destinationId);
  const displayReviewCount =
    reviewCount ?? getDestinationReviewCount(destinationId, displayRating);
  const stars = Math.min(5, Math.max(0, Math.round(displayRating)));
  const galleryImagesResolved = getDestinationGalleryImages(destinationId, image, galleryImages);

  return (
    <Link
      ref={tilt ? tiltRef : undefined}
      href={href}
      className={cn(
        "destination-card group flex h-full flex-col overflow-hidden rounded-xl border border-glass-border bg-surface transition-all duration-500",
        "shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)] hover:border-gold/30 hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.22)]",
        !tilt && "hover:-translate-y-0.5",
        tilt && "[transform-style:preserve-3d] will-change-transform",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <HotelImageSlider
          images={galleryImagesResolved}
          alt={name}
          className="h-full w-full"
          intervalMs={DESTINATION_SLIDE_INTERVAL_MS}
          showIndicators={false}
          pauseOnHover
        />
        {duration && (
          <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full border border-glass-border bg-surface/95 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.14em] text-foreground uppercase shadow-sm backdrop-blur-sm">
            <Clock size={10} className="text-gold" aria-hidden />
            {duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {(location || regionLabel) && (
          <p className="text-[9px] font-semibold tracking-[0.18em] text-gold uppercase">
            {location}
            {location && regionLabel && (
              <span className="text-muted"> · {regionLabel}</span>
            )}
            {!location && regionLabel}
          </p>
        )}

        <h3 className="mt-1 line-clamp-2 font-display text-lg leading-snug text-foreground">
          {name}
        </h3>

        {stars > 0 && (
          <div
            className="mt-1.5 flex flex-wrap items-center gap-1"
            aria-label={`${displayRating.toFixed(1)} out of 5 from ${displayReviewCount} guest reviews`}
          >
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} size={11} className="fill-gold text-gold" aria-hidden />
            ))}
            <span className="text-[11px] font-medium text-foreground">{displayRating.toFixed(1)}</span>
            <span className="text-[11px] text-muted">
              ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}

        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-sand">
          {description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3.5">
          {startingPrice != null ? (
            <PriceDisplay amount={startingPrice} label="Onwards" size="sm" />
          ) : (
            <span />
          )}
          <span
            className={cn(
              "shrink-0 rounded-full border border-glass-border bg-surface px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-foreground uppercase",
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
