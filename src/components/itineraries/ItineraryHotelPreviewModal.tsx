"use client";

import { useEffect } from "react";
import { Clock, MapPin, Star, X } from "lucide-react";
import type { ItineraryHotel } from "@/types/itinerary";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";

type ItineraryHotelPreviewModalProps = {
  hotel: ItineraryHotel;
  onClose: () => void;
};

export function ItineraryHotelPreviewModal({ hotel, onClose }: ItineraryHotelPreviewModalProps) {
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
      aria-labelledby="itinerary-hotel-title"
      data-lenis-prevent
    >
      <div
        className="relative flex max-h-[94vh] min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-gold/20 bg-surface shadow-2xl sm:rounded-3xl"
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <SafeImage
              src={hotel.image}
              alt={hotel.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            {hotel.category && (
              <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
                {hotel.category}
              </p>
            )}

            <h2 id="itinerary-hotel-title" className="mt-2 font-display text-3xl text-foreground">
              {hotel.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-gold" aria-hidden />
                {hotel.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} className="text-gold" aria-hidden />
                {hotel.nights}
              </span>
            </div>

            {hotel.stars ? (
              <div className="mt-4 flex items-center gap-1" aria-label={`${hotel.stars} star property`}>
                {[...Array(hotel.stars)].map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" aria-hidden />
                ))}
              </div>
            ) : null}

            <p className="mt-4 text-sm leading-relaxed text-muted">{hotel.description}</p>

            {hotel.roomType && (
              <p className="mt-4 text-sm text-muted">
                <span className="font-medium text-foreground">Room:</span> {hotel.roomType}
              </p>
            )}
            {hotel.mealPlan && (
              <p className="mt-2 text-sm text-muted">
                <span className="font-medium text-foreground">Meals:</span> {hotel.mealPlan}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton as="a" href="#inquiry" variant="primary" onClick={onClose}>
                Request This Stay
              </MagneticButton>
              <MagneticButton variant="secondary" onClick={onClose}>
                Close
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
