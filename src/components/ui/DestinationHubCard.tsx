"use client";

import Link from "next/link";
import { ArrowRight, Layers, MapPin } from "lucide-react";
import { resolveDestinationHeroImage } from "@/lib/destination-images";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";

type DestinationHubCardProps = {
  name: string;
  description: string;
  image: string;
  destinationId: string;
  href: string;
  regionLabel?: string;
  journeyCount: number;
  startingPrice?: number;
  className?: string;
  tilt?: boolean;
};

export function DestinationHubCard({
  name,
  description,
  image,
  destinationId,
  href,
  regionLabel,
  journeyCount,
  startingPrice,
  className,
}: DestinationHubCardProps) {
  const heroImage = resolveDestinationHeroImage(destinationId, { cmsImage: image });
  return (
    <Link
      href={href}
      className={cn(
        "destination-hub-card group flex h-full flex-col overflow-hidden rounded-xl border border-glass-border bg-surface",
        "shadow-[0_8px_28px_-12px_rgba(0,0,0,0.16)] transition-all duration-500",
        "hover:border-gold/35 hover:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.24)] hover:-translate-y-0.5",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className
      )}
    >
      <div className="destination-hub-card__media">
        <SafeImage
          src={heroImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-black/10"
          aria-hidden
        />

        <span className="destination-hub-card__count-badge absolute top-3 right-3 z-20">
          {journeyCount} {journeyCount === 1 ? "package" : "packages"}
        </span>

        <div className="absolute inset-x-0 bottom-0 z-20 p-3.5">
          {regionLabel && (
            <p className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] text-gold-light uppercase">
              <MapPin size={10} aria-hidden />
              {regionLabel}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg leading-tight text-white">
            {name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-gold uppercase">
          <Layers size={12} aria-hidden />
          Destination collection
        </p>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {description}
        </p>

        <div className="destination-hub-card__footer mt-auto pt-3.5">
          <div className="min-w-0">
            {startingPrice != null ? (
              <PriceDisplay
                amount={startingPrice}
                label="Packages onwards"
                size="sm"
                emphasized
              />
            ) : (
              <>
                <p className="text-[9px] font-bold tracking-[0.18em] text-sand uppercase">
                  Multiple itineraries
                </p>
                <p className="mt-0.5 text-xs text-foreground">
                  Choose from {journeyCount} curated options
                </p>
              </>
            )}
          </div>
          <span className="destination-hub-card__cta">
            Browse
            <ArrowRight size={14} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
