"use client";

import { X, Star, Clock, MapPin } from "lucide-react";
import type { TravelPackage } from "@/types";
import { formatPrice } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface PackageDetailModalProps {
  pkg: TravelPackage;
  onClose: () => void;
}

export function PackageDetailModal({ pkg, onClose }: PackageDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-background/90 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-detail-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-gold/20 bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 glass transition-colors hover:text-gold"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
          <SafeImage
            src={pkg.image}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-1 glass rounded-full px-3 py-1">
            <Star size={14} className="fill-gold text-gold" />
            <span className="text-sm text-foreground">{pkg.rating}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">{pkg.destination}</p>
          <h2 id="package-detail-title" className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
            {pkg.title}
          </h2>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-gold" />
              {pkg.duration}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-gold" />
              {pkg.region === "domestic" ? "India" : "International"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {pkg.mood.map((m) => (
              <span key={m} className="glass rounded-full px-3 py-1 text-xs capitalize text-sand">
                {m}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xs tracking-[0.2em] text-gold uppercase">Package Highlights</h3>
            <ul className="mt-4 space-y-2">
              {pkg.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-glass-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted">Starting from</p>
              <p className="font-display text-3xl text-gold">{formatPrice(pkg.price)}</p>
              <p className="mt-1 text-xs text-muted">Per person · taxes included</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <MagneticButton onClick={onClose} variant="secondary" className="!px-6 !py-3">
                Close
              </MagneticButton>
              <MagneticButton
                as="a"
                href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                variant="primary"
                className="!px-6 !py-3"
              >
                Book This Package
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
