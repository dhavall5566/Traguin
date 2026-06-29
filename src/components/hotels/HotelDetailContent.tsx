"use client";

import { Star, MapPin, Sparkles, Navigation } from "lucide-react";
import type { Hotel } from "@/types";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { HotelBookingForm } from "@/components/hotels/HotelBookingForm";
import { HotelReviewForm } from "@/components/hotels/HotelReviewForm";
import { SimilarHotelsSlider } from "@/components/hotels/SimilarHotelsSlider";
import { getHotelGalleryImages } from "@/lib/hotel-images";
import { getHotelReviewCount, getHotelDestinationLabel, getHotelImageAlt } from "@/lib/hotels";

type HotelDetailContentProps = {
  hotel: Hotel;
  allHotels?: Hotel[];
  titleId?: string;
  onSelectHotel?: (hotel: Hotel) => void;
  similarLinkMode?: "select" | "navigate";
};

export function HotelDetailContent({
  hotel,
  allHotels,
  titleId = "hotel-detail-title",
  onSelectHotel,
  similarLinkMode = "select",
}: HotelDetailContentProps) {
  const reviewCount = getHotelReviewCount(hotel);
  const destinationLabel = getHotelDestinationLabel(hotel);

  return (
    <>
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-[21/9]">
        <HotelImageSlider
          images={getHotelGalleryImages(hotel)}
          alt={getHotelImageAlt(hotel)}
          className="h-full w-full"
          showIndicators
        />
      </div>

      <div className="border-b border-glass-border bg-surface px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 pr-10 sm:pr-0">
            <h2 id={titleId} className="font-display text-2xl text-foreground sm:text-4xl">
              {hotel.name}
            </h2>
            {destinationLabel && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={14} className="shrink-0 text-gold" />
                {destinationLabel}
              </p>
            )}
            {hotel.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {hotel.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-end gap-6 sm:flex-col sm:items-end">
            <PriceDisplay amount={hotel.price} label="Onwards" size="lg" suffix="/night" />
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
          {hotel.amenities.length > 0 && (
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
          )}

          {hotel.nearbyAttractions.length > 0 && (
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
          )}
        </div>

        <div className="glass overflow-hidden rounded-2xl border border-glass-border p-5 md:p-6">
          <HotelReviewForm hotel={hotel} compact />
        </div>

        <HotelBookingForm hotel={hotel} />

        <SimilarHotelsSlider
          hotel={hotel}
          allHotels={allHotels}
          onSelectHotel={onSelectHotel}
          linkMode={similarLinkMode}
        />
      </div>
    </>
  );
}
