"use client";

import { useState } from "react";
import {
  Map,
  Grid3X3,
  Heart,
  GitCompare,
  Star,
  X,
} from "lucide-react";
import { hotels } from "@/data/hotels";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HotelDiscovery() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [preview, setPreview] = useState<(typeof hotels)[0] | null>(null);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [amenityFilter, setAmenityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const countries = ["all", ...new Set(hotels.map((h) => h.destination))];
  const amenityOptions = ["all", ...new Set(hotels.flatMap((h) => h.amenities))].slice(0, 8);
  const propertyTypes = ["all", "Resort", "Hotel", "Villa", "Palace"];

  const filtered = hotels.filter((h) => {
    if (countryFilter !== "all" && h.destination !== countryFilter) return false;
    if (priceFilter === "under50" && h.price >= 50000) return false;
    if (priceFilter === "50-100" && (h.price < 50000 || h.price > 100000)) return false;
    if (priceFilter === "over100" && h.price <= 100000) return false;
    if (amenityFilter !== "all" && !h.amenities.some((a) => a.includes(amenityFilter))) return false;
    if (typeFilter !== "all") {
      const name = h.name.toLowerCase();
      if (typeFilter === "Resort" && !name.includes("resort") && !name.includes("aman")) return false;
      if (typeFilter === "Villa" && !name.includes("villa")) return false;
      if (typeFilter === "Palace" && !name.includes("palace")) return false;
      if (typeFilter === "Hotel" && (name.includes("villa") || name.includes("palace"))) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">Accommodations</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            Luxury Stays
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Discover handpicked properties where exceptional service meets extraordinary settings.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="w-full text-[10px] tracking-wide text-muted uppercase sm:w-auto sm:mr-2 sm:self-center">Country</span>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs transition-all",
                    countryFilter === c ? "bg-gold text-on-gold" : "glass text-muted hover:border-gold/30"
                  )}
                >
                  {c === "all" ? "All" : c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="w-full text-[10px] tracking-wide text-muted uppercase sm:w-auto sm:mr-2 sm:self-center">Type</span>
              {propertyTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs transition-all",
                    typeFilter === t ? "bg-gold text-on-gold" : "glass text-muted hover:border-gold/30"
                  )}
                >
                  {t === "all" ? "All Types" : t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="w-full text-[10px] tracking-wide text-muted uppercase sm:w-auto sm:mr-2 sm:self-center">Price</span>
              {[
                { id: "all", label: "All" },
                { id: "under50", label: "Under ₹50K" },
                { id: "50-100", label: "₹50K–₹1L" },
                { id: "over100", label: "₹1L+" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriceFilter(p.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs transition-all",
                    priceFilter === p.id ? "bg-gold text-on-gold" : "glass text-muted hover:border-gold/30"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="w-full text-[10px] tracking-wide text-muted uppercase sm:w-auto sm:mr-2 sm:self-center">Amenities</span>
              {amenityOptions.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmenityFilter(a)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs transition-all max-w-[10rem] truncate",
                    amenityFilter === a ? "bg-gold text-on-gold" : "glass text-muted hover:border-gold/30"
                  )}
                >
                  {a === "all" ? "All" : a}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-full p-2",
                  view === "grid" ? "bg-gold text-on-gold" : "glass text-muted"
                )}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView("map")}
                className={cn(
                  "rounded-full p-2",
                  view === "map" ? "bg-gold text-on-gold" : "glass text-muted"
                )}
              >
                <Map size={18} />
              </button>
            </div>
          </div>

          {view === "grid" ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((hotel) => (
                <article
                  key={hotel.id}
                  className="group overflow-hidden rounded-3xl glass transition-all duration-500 hover:border-gold/30 hover:-translate-y-2"
                  style={{ transform: "perspective(1000px)" }}
                >
                  <div
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                    onClick={() => setPreview(hotel)}
                  >
                    <SafeImage
                      src={hotel.image}
                      alt={`${hotel.name}, ${hotel.destination}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWishlist((prev) =>
                            prev.includes(hotel.id)
                              ? prev.filter((x) => x !== hotel.id)
                              : [...prev, hotel.id]
                          );
                        }}
                        className={cn(
                          "rounded-full p-2 glass",
                          wishlist.includes(hotel.id) && "text-gold"
                        )}
                      >
                        <Heart size={16} fill={wishlist.includes(hotel.id) ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompare((prev) =>
                            prev.includes(hotel.id)
                              ? prev.filter((x) => x !== hotel.id)
                              : prev.length < 3 ? [...prev, hotel.id] : prev
                          );
                        }}
                        className={cn(
                          "rounded-full p-2 glass",
                          compare.includes(hotel.id) && "text-gold"
                        )}
                      >
                        <GitCompare size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1">
                      {[...Array(hotel.stars)].map((_, i) => (
                        <Star key={i} size={12} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <h3 className="mt-2 font-display text-xl text-foreground">{hotel.name}</h3>
                    <p className="text-sm text-muted">{hotel.destination}</p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="text-[10px] text-sand">{a}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <PriceDisplay amount={hotel.price} label="From" size="md" suffix="/night" />
                      <MagneticButton
                        variant="secondary"
                        className="!px-4 !py-2 !text-xs"
                        onClick={() => setPreview(hotel)}
                      >
                        View Property
                      </MagneticButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 glass rounded-3xl p-12 text-center">
              <Map size={48} className="mx-auto text-gold/30" />
              <p className="mt-4 text-muted">Map view — {filtered.length} luxury properties</p>
            </div>
          )}
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6 backdrop-blur-xl"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-2xl overflow-hidden rounded-3xl glass"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-4 right-4 z-10 rounded-full p-2 glass"
            >
              <X size={20} />
            </button>
            <SafeImage src={preview.image} alt={preview.name} className="aspect-video w-full object-cover" />
            <div className="p-8">
              <h3 className="font-display text-3xl text-foreground">{preview.name}</h3>
              <p className="text-sand">{preview.destination}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {preview.amenities.map((a) => (
                  <span key={a} className="glass rounded-full px-3 py-1 text-xs">{a}</span>
                ))}
              </div>
              <div className="mt-6">
                <PriceDisplay amount={preview.price} label="From" size="lg" suffix="/night" />
              </div>
              <MagneticButton as="a" href="/contact" variant="primary" className="mt-6">
                View Property
              </MagneticButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
