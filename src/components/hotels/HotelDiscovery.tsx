"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  GitCompare,
  Star,
  Search,
  X,
  Sparkles,
  Waves,
  Landmark,
  Mountain,
  UtensilsCrossed,
  Building2,
  Hotel as HotelIcon,
  Home,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { hotels } from "@/data/hotels";
import type { Hotel } from "@/types";
import { HotelDetailModal } from "@/components/hotels/HotelDetailModal";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getHotelById, getHotelReviewCount } from "@/lib/hotels";
import { cn } from "@/lib/utils";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { getHotelGalleryImages } from "@/lib/hotel-images";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FilterDropdown, type FilterDropdownOption } from "@/components/ui/FilterDropdown";

const PROPERTY_TYPES = ["all", "Resort", "Hotel", "Villa", "Palace"] as const;

const PRICE_FILTERS = [
  { id: "all", label: "All prices" },
  { id: "under50", label: "Under ₹50K" },
  { id: "50-100", label: "₹50K–₹1L" },
  { id: "over100", label: "₹1L+" },
] as const;

const AMENITY_FILTERS = [
  { id: "all", label: "All amenities", icon: Sparkles, keywords: [] as string[] },
  { id: "spa", label: "Spa & wellness", icon: Sparkles, keywords: ["spa", "wellness", "ayurveda", "onsen"] },
  { id: "beach", label: "Beach & pool", icon: Waves, keywords: ["beach", "pool", "infinity"] },
  { id: "heritage", label: "Heritage", icon: Landmark, keywords: ["heritage", "palace", "historic", "colonial", "ryokan"] },
  { id: "views", label: "Scenic views", icon: Mountain, keywords: ["mountain", "lake", "cliff", "views", "matterhorn", "dal"] },
  { id: "dining", label: "Fine dining", icon: UtensilsCrossed, keywords: ["michelin", "dining", "restaurant", "chef", "cuisine"] },
] as const;

const PROPERTY_TYPE_META: Record<(typeof PROPERTY_TYPES)[number], { label: string; icon: LucideIcon }> = {
  all: { label: "All types", icon: Building2 },
  Resort: { label: "Resort", icon: Building2 },
  Hotel: { label: "Hotel", icon: HotelIcon },
  Villa: { label: "Villa", icon: Home },
  Palace: { label: "Palace", icon: Crown },
};

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: Low to high" },
  { id: "price-desc", label: "Price: High to low" },
  { id: "rating", label: "Top rated" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

export function HotelDiscovery() {
  const searchParams = useSearchParams();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const openHotel = (hotel: Hotel) => setSelectedHotel(hotel);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [amenityFilter, setAmenityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortId>("recommended");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const countries = useMemo(
    () => ["all", ...[...new Set(hotels.map((h) => h.destination))].sort()],
    []
  );

  const destinationOptions = useMemo<FilterDropdownOption[]>(
    () =>
      countries.map((c) => ({
        value: c,
        label: c === "all" ? "All destinations" : c,
      })),
    [countries]
  );

  const propertyTypeOptions = useMemo<FilterDropdownOption[]>(
    () =>
      PROPERTY_TYPES.map((t) => ({
        value: t,
        label: PROPERTY_TYPE_META[t].label,
        icon: PROPERTY_TYPE_META[t].icon,
      })),
    []
  );

  const priceOptions = useMemo<FilterDropdownOption[]>(
    () => PRICE_FILTERS.map((p) => ({ value: p.id, label: p.label })),
    []
  );

  const amenityOptions = useMemo<FilterDropdownOption[]>(
    () =>
      AMENITY_FILTERS.map((a) => ({
        value: a.id,
        label: a.label,
        icon: a.icon,
      })),
    []
  );

  const sortOptions = useMemo<FilterDropdownOption[]>(
    () => SORT_OPTIONS.map((o) => ({ value: o.id, label: o.label })),
    []
  );

  useEffect(() => {
    const hotelId = searchParams.get("hotel");
    if (hotelId) {
      const hotel = getHotelById(hotelId);
      if (hotel) setSelectedHotel(hotel);
    }

    const destination = searchParams.get("destination");
    if (destination) {
      const match = hotels.find(
        (h) => h.destination.toLowerCase() === destination.toLowerCase()
      );
      setCountryFilter(match ? match.destination : destination);
    }
  }, [searchParams]);

  const amenityKeywords =
    AMENITY_FILTERS.find((a) => a.id === amenityFilter)?.keywords ?? [];

  const hasActiveFilters =
    countryFilter !== "all" ||
    priceFilter !== "all" ||
    amenityFilter !== "all" ||
    typeFilter !== "all" ||
    searchQuery.trim().length > 0;

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (searchQuery.trim()) {
      chips.push({
        key: "search",
        label: `"${searchQuery.trim()}"`,
        clear: () => setSearchQuery(""),
      });
    }
    if (countryFilter !== "all") {
      chips.push({
        key: "destination",
        label: countryFilter,
        clear: () => setCountryFilter("all"),
      });
    }
    if (typeFilter !== "all") {
      chips.push({
        key: "type",
        label: typeFilter,
        clear: () => setTypeFilter("all"),
      });
    }
    if (priceFilter !== "all") {
      const priceLabel = PRICE_FILTERS.find((p) => p.id === priceFilter)?.label ?? priceFilter;
      chips.push({
        key: "price",
        label: priceLabel,
        clear: () => setPriceFilter("all"),
      });
    }
    if (amenityFilter !== "all") {
      const amenityLabel =
        AMENITY_FILTERS.find((a) => a.id === amenityFilter)?.label ?? amenityFilter;
      chips.push({
        key: "amenity",
        label: amenityLabel,
        clear: () => setAmenityFilter("all"),
      });
    }
    return chips;
  }, [amenityFilter, countryFilter, priceFilter, searchQuery, typeFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setCountryFilter("all");
    setPriceFilter("all");
    setAmenityFilter("all");
    setTypeFilter("all");
    setSortBy("recommended");
  };

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = hotels.filter((h) => {
      if (query) {
        const haystack = `${h.name} ${h.destination} ${h.description ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (countryFilter !== "all" && h.destination !== countryFilter) return false;
      if (priceFilter === "under50" && h.price >= 50000) return false;
      if (priceFilter === "50-100" && (h.price < 50000 || h.price > 100000)) return false;
      if (priceFilter === "over100" && h.price <= 100000) return false;
      if (amenityFilter !== "all") {
        const hasAmenity = h.amenities.some((a) =>
          amenityKeywords.some((kw) => a.toLowerCase().includes(kw))
        );
        if (!hasAmenity) return false;
      }
      if (typeFilter !== "all") {
        const name = h.name.toLowerCase();
        if (typeFilter === "Resort" && !name.includes("resort") && !name.includes("aman")) return false;
        if (typeFilter === "Villa" && !name.includes("villa")) return false;
        if (typeFilter === "Palace" && !name.includes("palace")) return false;
        if (typeFilter === "Hotel" && (name.includes("villa") || name.includes("palace"))) return false;
      }
      return true;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.rating - a.rating || a.price - b.price;
    });
  }, [
    amenityFilter,
    amenityKeywords,
    countryFilter,
    priceFilter,
    searchQuery,
    sortBy,
    typeFilter,
  ]);

  return (
    <div className="pb-16 md:pb-20 pt-12 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">Accommodations</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            Luxury Stays
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Discover handpicked properties where exceptional service meets extraordinary settings.
          </p>

          <section
            className="mt-6 rounded-3xl border border-glass-border bg-surface/80 p-4 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)] sm:p-5"
            aria-label="Filter luxury stays"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search properties</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by property or destination…"
                  className="w-full rounded-xl border border-glass-border bg-background/40 py-2.5 pr-4 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-gold/50"
                />
              </label>
              <p className="shrink-0 self-start rounded-full border border-gold/25 bg-gold/8 px-4 py-2 text-sm sm:self-center">
                <span className="font-medium text-gold">{filtered.length}</span>
                <span className="text-muted">
                  {" "}
                  {filtered.length === 1 ? "property" : "properties"}
                </span>
              </p>
            </div>

            {activeFilterChips.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-foreground transition-colors hover:border-gold/50"
                  >
                    {chip.label}
                    <X size={12} className="text-gold" aria-hidden />
                    <span className="sr-only">Remove {chip.label} filter</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="relative z-10 mt-4 grid gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <FilterDropdown
                id="destination"
                label="Destination"
                value={countryFilter}
                options={destinationOptions}
                onChange={setCountryFilter}
                isOpen={openDropdown === "destination"}
                onToggle={setOpenDropdown}
              />
              <FilterDropdown
                id="property-type"
                label="Property type"
                value={typeFilter}
                options={propertyTypeOptions}
                onChange={setTypeFilter}
                isOpen={openDropdown === "property-type"}
                onToggle={setOpenDropdown}
              />
              <FilterDropdown
                id="price"
                label="Price per night"
                value={priceFilter}
                options={priceOptions}
                onChange={setPriceFilter}
                isOpen={openDropdown === "price"}
                onToggle={setOpenDropdown}
              />
              <FilterDropdown
                id="amenities"
                label="Amenities"
                value={amenityFilter}
                options={amenityOptions}
                onChange={setAmenityFilter}
                isOpen={openDropdown === "amenities"}
                onToggle={setOpenDropdown}
              />
              <FilterDropdown
                id="sort"
                label="Sort by"
                value={sortBy}
                options={sortOptions}
                onChange={(value) => setSortBy(value as SortId)}
                isOpen={openDropdown === "sort"}
                onToggle={setOpenDropdown}
              />
            </div>
          </section>

          {filtered.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-glass-border bg-surface/60 px-6 py-16 text-center">
              <p className="font-display text-xl text-foreground">No properties match your filters</p>
              <p className="mt-2 text-sm text-muted">Try adjusting destination, price, or search terms.</p>
              {hasActiveFilters && (
                <MagneticButton variant="secondary" className="mt-6" onClick={clearFilters}>
                  Clear all filters
                </MagneticButton>
              )}
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((hotel) => {
                const reviewCount = getHotelReviewCount(hotel);
                return (
                <article
                  key={hotel.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openHotel(hotel)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openHotel(hotel);
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-3xl glass transition-all duration-500 hover:border-gold/30 hover:-translate-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  style={{ transform: "perspective(1000px)" }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <HotelImageSlider
                      images={getHotelGalleryImages(hotel)}
                      alt={`${hotel.name}, ${hotel.destination}`}
                      className="h-full w-full"
                      showIndicators={false}
                      pauseOnHover
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
                    <div
                      className="flex items-center gap-1.5"
                      aria-label={`${hotel.rating.toFixed(1)} out of 5 guest rating`}
                    >
                      {[...Array(hotel.stars)].map((_, i) => (
                        <Star key={i} size={12} className="fill-gold text-gold" aria-hidden />
                      ))}
                      <span className="text-xs text-foreground">{hotel.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted">
                        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                      </span>
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
                        onClick={() => openHotel(hotel)}
                      >
                        View Property
                      </MagneticButton>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onSelectHotel={setSelectedHotel}
        />
      )}
    </div>
  );
}
