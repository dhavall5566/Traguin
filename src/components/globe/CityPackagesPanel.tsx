"use client";

import { X, Star, Clock } from "lucide-react";
import type { TravelPackage } from "@/types";
import type { GlobeMarker } from "@/components/three/Globe";
import { formatPrice } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface CityPackagesPanelProps {
  city: GlobeMarker;
  packages: TravelPackage[];
  onClose: () => void;
  onPackageClick?: (pkg: TravelPackage) => void;
}

export function CityPackagesPanel({ city, packages, onClose, onPackageClick }: CityPackagesPanelProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 max-h-[70vh] animate-fade-in md:inset-x-auto md:bottom-8 md:left-8 md:max-h-[75vh] md:w-[420px]">
      <div className="flex max-h-[70vh] flex-col rounded-t-3xl border border-gold/20 bg-surface/95 shadow-2xl shadow-black/50 backdrop-blur-xl md:rounded-3xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-glass-border p-5">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">Packages in</p>
            <h3 className="font-display text-2xl text-foreground">{city.name}</h3>
            {city.country && <p className="text-sm text-sand">{city.country}</p>}
            <p className="mt-1 text-xs text-muted">
              {packages.length} package{packages.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-glass hover:text-foreground"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Package list */}
        <div className="flex-1 overflow-y-auto p-4">
          {packages.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No packages found for this city yet.
            </p>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onPackageClick?.(pkg)}
                  onKeyDown={(e) => e.key === "Enter" && onPackageClick?.(pkg)}
                  className="cursor-pointer overflow-hidden rounded-2xl border border-glass-border bg-input transition-colors hover:border-gold/30"
                >
                  <div className="flex gap-3 p-3">
                    <SafeImage
                      src={pkg.image}
                      alt={pkg.title}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium text-foreground">{pkg.title}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                        <Clock size={12} />
                        {pkg.duration}
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Star size={11} className="fill-gold text-gold" />
                        <span className="text-xs text-foreground">{pkg.rating}</span>
                      </div>
                      <p className="mt-1 font-display text-sm text-gold">
                        {formatPrice(pkg.price)}
                      </p>
                    </div>
                  </div>
                  <ul className="border-t border-glass-border px-3 py-2">
                    {pkg.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="text-[11px] text-muted">• {h}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-glass-border p-4">
          <MagneticButton
            as="a"
            href={`/packages/${city.region}?destination=${city.id}`}
            variant="primary"
            className="w-full !py-3 !text-xs"
          >
            View All on Packages Page
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
