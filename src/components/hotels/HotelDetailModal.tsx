"use client";

import { useEffect } from "react";
import { X, Star, MapPin, Sparkles, Navigation } from "lucide-react";
import type { Hotel } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SafeImage } from "@/components/ui/SafeImage";
import { HotelBookingForm } from "@/components/hotels/HotelBookingForm";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";
import { cn } from "@/lib/utils";

type HotelDetailModalProps = {
  hotel: Hotel;
  onClose: () => void;
};

export function HotelDetailModal({ hotel, onClose }: HotelDetailModalProps) {
  useModalScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-background/90 p-0 backdrop-blur-md sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotel-detail-title"
      data-lenis-prevent
    >
      <div
        className="relative flex max-h-[94vh] min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-gold/20 bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full p-2 glass transition-colors hover:text-gold"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
          data-lenis-prevent
        >
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-[21/9]">
            <SafeImage
              src={hotel.image}
              alt={`${hotel.name}, ${hotel.destination}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 sm:right-16 sm:bottom-6 sm:left-6">
              <div className="flex items-center gap-1">
                {[...Array(hotel.stars)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <h2
                id="hotel-detail-title"
                className="mt-2 font-display text-2xl text-foreground sm:text-4xl"
              >
                {hotel.name}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={14} className="text-gold" />
                {hotel.destination}
              </p>
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-5 lg:gap-10 lg:p-8">
            <div className="space-y-8 lg:col-span-3">
              {hotel.description && (
                <p className="text-sm leading-relaxed text-muted md:text-base">{hotel.description}</p>
              )}

              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-glass-border pb-6">
                <PriceDisplay amount={hotel.price} label="From" size="lg" suffix="/night" />
                <span className="text-sm text-muted">
                  Guest rating <span className="text-gold">{hotel.rating}</span>/5
                </span>
              </div>

              <section>
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" />
                  <h3 className="font-display text-xl text-foreground">Amenities</h3>
                </div>
                <p className="mt-1 text-sm text-muted">
                  Everything included during your stay at {hotel.name}.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {hotel.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-3 py-2.5 text-sm text-foreground"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2">
                  <Navigation size={18} className="text-gold" />
                  <h3 className="font-display text-xl text-foreground">Nearby Attractions</h3>
                </div>
                <p className="mt-1 text-sm text-muted">Distances from the property.</p>
                <ul className="mt-4 divide-y divide-glass-border rounded-2xl border border-glass-border">
                  {hotel.nearbyAttractions.map((spot, index) => (
                    <li
                      key={spot.name}
                      className={cn(
                        "flex items-center justify-between gap-4 px-4 py-3.5 text-sm",
                        index === 0 && "rounded-t-2xl",
                        index === hotel.nearbyAttractions.length - 1 && "rounded-b-2xl"
                      )}
                    >
                      <span className="text-foreground">{spot.name}</span>
                      <span className="shrink-0 font-medium text-gold">{spot.distance}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="lg:col-span-2 lg:self-start">
              <HotelBookingForm hotel={hotel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
