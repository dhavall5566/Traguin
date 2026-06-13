"use client";

import { useEffect, useRef } from "react";
import { X, Star, MapPin, Sparkles, Navigation } from "lucide-react";
import type { Hotel } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { HotelBookingForm } from "@/components/hotels/HotelBookingForm";
import { HotelReviewForm } from "@/components/hotels/HotelReviewForm";
import { SimilarHotelsSlider } from "@/components/hotels/SimilarHotelsSlider";
import { getHotelGalleryImages } from "@/lib/hotel-images";
import { getHotelReviewCount } from "@/lib/hotels";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";

type HotelDetailModalProps = {
  hotel: Hotel;
  onClose: () => void;
  onSelectHotel?: (hotel: Hotel) => void;
};

export function HotelDetailModal({ hotel, onClose, onSelectHotel }: HotelDetailModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reviewCount = getHotelReviewCount(hotel);
  useModalScrollLock(true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [hotel.id]);

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
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
          data-lenis-prevent
        >
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-[21/9]">
            <HotelImageSlider
              images={getHotelGalleryImages(hotel)}
              alt={`${hotel.name}, ${hotel.destination}`}
              className="h-full w-full"
              showIndicators
            />
          </div>

          <div className="border-b border-glass-border bg-surface px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 pr-10 sm:pr-0">
                <h2
                  id="hotel-detail-title"
                  className="font-display text-2xl text-foreground sm:text-4xl"
                >
                  {hotel.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin size={14} className="shrink-0 text-gold" />
                  {hotel.destination}
                </p>
                {hotel.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {hotel.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-end gap-6 sm:flex-col sm:items-end">
                <PriceDisplay amount={hotel.price} label="From" size="lg" suffix="/night" />
                <div className="flex flex-col items-start gap-1 sm:items-end">
                  <div className="flex items-center gap-1" aria-label={`${hotel.stars} star property`}>
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-sm text-muted">
                    <span className="text-gold">{hotel.rating.toFixed(1)}</span>/5 · {reviewCount}{" "}
                    guest {reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-6 lg:gap-4 lg:p-8">
            <div className="glass divide-y divide-glass-border overflow-hidden rounded-2xl border border-glass-border">
              <section className="p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" />
                  <h3 className="font-display text-lg text-foreground">Amenities</h3>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {hotel.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg border border-glass-border bg-surface/80 px-3 py-2 text-sm text-foreground"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <Navigation size={18} className="text-gold" />
                  <h3 className="font-display text-lg text-foreground">Nearby Attractions</h3>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {hotel.nearbyAttractions.map((spot) => (
                    <li
                      key={spot.name}
                      className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-surface/80 px-3 py-2.5 text-sm"
                    >
                      <span className="text-foreground">{spot.name}</span>
                      <span className="shrink-0 text-xs font-medium text-gold">{spot.distance}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="glass overflow-hidden rounded-2xl border border-glass-border p-5 md:p-6">
              <HotelReviewForm hotel={hotel} compact />
            </div>

            <HotelBookingForm hotel={hotel} />

            {onSelectHotel && <SimilarHotelsSlider hotel={hotel} onSelectHotel={onSelectHotel} />}
          </div>
        </div>
      </div>
    </div>
  );
}
