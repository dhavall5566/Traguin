"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import type { DestinationHotelCard } from "@/lib/hotels";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";

type DestinationHotelsSliderProps = {
  destinationName: string;
  hotels: DestinationHotelCard[];
  subtitle?: string;
};

export function DestinationHotelsSlider({
  destinationName,
  hotels,
  subtitle = "Other handpicked properties our concierge recommends while you plan this journey.",
}: DestinationHotelsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 8);
  };

  const scrollBy = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(300, track.clientWidth * 0.78);
    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    window.setTimeout(updateScrollState, 320);
  };

  if (hotels.length === 0) return null;

  return (
    <section
      className="glass overflow-hidden rounded-2xl border border-glass-border p-5 md:p-6"
      aria-label={`Luxury stays in ${destinationName}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-[0.28em] text-gold uppercase">
            Curated for you
          </p>
          <h3 className="mt-1 font-display text-xl text-foreground md:text-2xl">
            More stays in {destinationName}
          </h3>
          <p className="mt-2 max-w-lg text-sm text-muted">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => scrollBy("left")}
            disabled={!canScrollLeft}
            className="rounded-full border border-glass-border p-2 text-foreground transition-colors hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous stay"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("right")}
            disabled={!canScrollRight}
            className="rounded-full border border-glass-border p-2 text-foreground transition-colors hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next stay"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={(node) => {
          trackRef.current = node;
          if (node) requestAnimationFrame(updateScrollState);
        }}
        onScroll={updateScrollState}
        className="mt-6 flex gap-5 overflow-x-auto pb-1 [scrollbar-width:none] snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
      >
        {hotels.map((item) => (
          <article
            key={item.key}
            className="group w-[min(100%,19rem)] shrink-0 snap-start sm:w-[19rem]"
          >
            <Link
              href={item.href}
              className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-glass-border bg-surface text-left transition-all duration-500 hover:border-gold/35 hover:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.28)] hover:-translate-y-1"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <HotelImageSlider
                  images={item.images}
                  alt={`${item.name}, ${item.destination}`}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  showIndicators={false}
                  pauseOnHover
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                {item.category && (
                  <span className="absolute top-3 left-3 rounded-full border border-gold/30 bg-background/80 px-2.5 py-1 text-[9px] font-medium tracking-[0.15em] text-gold uppercase backdrop-blur-sm">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div
                  className="flex items-center gap-1.5"
                  aria-label={`${item.rating.toFixed(1)} out of 5 guest rating`}
                >
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} size={12} className="fill-gold text-gold" aria-hidden />
                  ))}
                  <span className="text-sm font-medium text-foreground">{item.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted">
                    ({item.reviewCount} {item.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>

                <h4 className="mt-2 font-display text-lg leading-snug text-foreground">{item.name}</h4>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                  <MapPin size={12} className="shrink-0 text-gold" aria-hidden />
                  {item.destination}
                </p>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sand">
                    {item.description}
                  </p>
                )}

                {item.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.amenities.slice(0, 2).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full border border-glass-border bg-surface/80 px-2.5 py-1 text-[10px] text-muted"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  {item.price != null ? (
                    <PriceDisplay amount={item.price} label="From" size="sm" suffix="/night" />
                  ) : (
                    <span className="text-xs tracking-wide text-muted uppercase">View property</span>
                  )}
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-[11px] font-medium tracking-wide text-foreground",
                      "transition-colors group-hover:border-gold/40 group-hover:text-gold"
                    )}
                  >
                    Explore
                    <ArrowUpRight size={12} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
