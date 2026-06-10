"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Search,
  X,
  Globe,
  MapPin,
  Sparkles,
  Compass,
  User,
  Landmark,
  TreePine,
  Users,
  Heart,
  Waves,
  Leaf,
  IndianRupee,
  Route,
  type LucideIcon,
} from "lucide-react";
import { destinationCategories } from "@/data/destinationCategories";
import {
  getAllDestinations,
  INDIA_REGION_FILTERS,
  INTERNATIONAL_COLLECTION_FILTERS,
} from "@/lib/destinations";
import { getItineraryByDestinationId } from "@/lib/itineraries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { primaryCta, secondaryCta } from "@/data/site";
import type { TravelMood } from "@/types";

const PRICE_FILTERS = [
  { id: "all", label: "All budgets" },
  { id: "under1L", label: "Under ₹1L" },
  { id: "1L-3L", label: "₹1L – ₹3L" },
  { id: "over3L", label: "₹3L+" },
] as const;

const REGION_FILTERS = [
  { id: "all", label: "All regions" },
  { id: "domestic", label: "India" },
  { id: "international", label: "International" },
] as const;

const MOOD_FILTERS: { id: TravelMood | "all"; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All styles", icon: Sparkles },
  { id: "solo", label: "Solo", icon: User },
  { id: "romantic", label: "Romantic", icon: Heart },
  { id: "family", label: "Family", icon: Users },
  { id: "luxury", label: "Luxury", icon: Sparkles },
  { id: "adventure", label: "Adventure", icon: Compass },
  { id: "cultural", label: "Cultural", icon: Landmark },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "nature", label: "Nature", icon: Leaf },
  { id: "wildlife", label: "Wildlife", icon: TreePine },
  { id: "spiritual", label: "Wellness", icon: Sparkles },
];

const ITINERARY_FILTERS = [
  { id: "all", label: "All journeys" },
  { id: "itinerary", label: "Full itinerary" },
  { id: "explore", label: "Destination guide" },
] as const;

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: Low to high" },
  { id: "price-desc", label: "Price: High to low" },
  { id: "name", label: "Name A–Z" },
] as const;

const DESTINATION_FILTER_IDS = [
  "region",
  "collection",
  "travel-style",
  "budget",
  "journey-type",
  "sort",
] as const;

type PriceFilterId = (typeof PRICE_FILTERS)[number]["id"];
type RegionFilterId = (typeof REGION_FILTERS)[number]["id"];
type MoodFilterId = (typeof MOOD_FILTERS)[number]["id"];
type ItineraryFilterId = (typeof ITINERARY_FILTERS)[number]["id"];
type SortId = (typeof SORT_OPTIONS)[number]["id"];

const allDestinations = getAllDestinations();

const ALL_COLLECTION_OPTIONS = [
  { value: "all", label: "All collections", icon: Globe },
  ...destinationCategories.map((category) => ({
    value: category.id,
    label: category.title,
    icon: MapPin,
  })),
];

const INDIA_AREA_OPTIONS = [
  { value: "all", label: "All areas", icon: Globe },
  ...INDIA_REGION_FILTERS.filter((region) => region.id !== "all").map((region) => ({
    value: region.id,
    label: region.label,
    icon: MapPin,
  })),
];

const INTERNATIONAL_COLLECTION_OPTIONS = [
  { value: "all", label: "All collections", icon: Globe },
  ...INTERNATIONAL_COLLECTION_FILTERS.map((category) => ({
    value: category.id,
    label: category.label,
    icon: MapPin,
  })),
];

function getSubRegionLabel(regionFilter: RegionFilterId) {
  if (regionFilter === "domestic") return "Area";
  return "Collection";
}

function getSubRegionOptions(regionFilter: RegionFilterId) {
  if (regionFilter === "domestic") return INDIA_AREA_OPTIONS;
  if (regionFilter === "international") return INTERNATIONAL_COLLECTION_OPTIONS;
  return ALL_COLLECTION_OPTIONS;
}

function matchesSubRegionFilter(
  dest: (typeof allDestinations)[number],
  categoryFilter: string,
  regionFilter: RegionFilterId
) {
  if (categoryFilter === "all") return true;

  const isIndiaArea = INDIA_REGION_FILTERS.some((region) => region.id === categoryFilter);

  if (regionFilter === "domestic" || (regionFilter === "all" && isIndiaArea)) {
    return dest.indiaRegion === categoryFilter;
  }

  return dest.categories.some((category) => category.id === categoryFilter);
}

function getSubRegionChipLabel(categoryFilter: string, regionFilter: RegionFilterId) {
  if (regionFilter === "domestic") {
    return INDIA_REGION_FILTERS.find((region) => region.id === categoryFilter)?.label ?? categoryFilter;
  }
  return (
    INTERNATIONAL_COLLECTION_FILTERS.find((category) => category.id === categoryFilter)?.label ??
    destinationCategories.find((category) => category.id === categoryFilter)?.title ??
    categoryFilter
  );
}

function DestinationGrid({
  destinations,
}: {
  destinations: {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
    startingPrice: number;
    duration?: string;
    hasItinerary: boolean;
  }[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((dest) => {
        const itinerary = getItineraryByDestinationId(dest.id);
        return (
          <DestinationCard
            key={dest.id}
            destinationId={dest.id}
            name={dest.name}
            location={dest.location}
            description={
              itinerary ? itinerary.highlights.slice(0, 3).join(" ") : dest.description
            }
            image={itinerary?.heroImage ?? dest.image}
            startingPrice={itinerary?.startingPrice ?? dest.startingPrice}
            href={`/destinations/${dest.id}`}
            cta={dest.hasItinerary ? "View Itinerary" : "View Destination"}
            duration={itinerary?.duration}
            rating={dest.hasItinerary ? 5 : 4}
          />
        );
      })}
    </div>
  );
}

export function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilterId>("all");
  const [moodFilter, setMoodFilter] = useState<MoodFilterId>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilterId>("all");
  const [itineraryFilter, setItineraryFilter] = useState<ItineraryFilterId>("all");
  const [sortBy, setSortBy] = useState<SortId>("recommended");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const activateSiblingFilter = useCallback((targetId: string) => {
    setOpenDropdown(targetId);
    window.requestAnimationFrame(() => {
      document.getElementById(`${targetId}-trigger`)?.focus({ preventScroll: true });
    });
  }, []);

  const subRegionOptions = useMemo(
    () => getSubRegionOptions(regionFilter),
    [regionFilter]
  );

  const subRegionLabel = getSubRegionLabel(regionFilter);

  const handleRegionFilterChange = (value: RegionFilterId) => {
    setRegionFilter(value);
    setCategoryFilter("all");
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    categoryFilter !== "all" ||
    regionFilter !== "all" ||
    moodFilter !== "all" ||
    priceFilter !== "all" ||
    itineraryFilter !== "all" ||
    sortBy !== "recommended";

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = allDestinations.filter((dest) => {
      if (query) {
        const indiaArea =
          dest.indiaRegion &&
          INDIA_REGION_FILTERS.find((region) => region.id === dest.indiaRegion)?.label;
        const haystack = `${dest.name} ${dest.description} ${dest.categoryTitle} ${indiaArea ?? ""} ${dest.categories
          .map((c) => c.title)
          .join(" ")}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (!matchesSubRegionFilter(dest, categoryFilter, regionFilter)) return false;
      if (regionFilter !== "all" && dest.region !== regionFilter) return false;
      if (moodFilter !== "all" && !dest.moods.includes(moodFilter)) return false;
      if (priceFilter === "under1L" && dest.startingPrice >= 100000) return false;
      if (priceFilter === "1L-3L" && (dest.startingPrice < 100000 || dest.startingPrice > 300000)) {
        return false;
      }
      if (priceFilter === "over3L" && dest.startingPrice <= 300000) return false;
      if (itineraryFilter === "itinerary" && !dest.hasItinerary) return false;
      if (itineraryFilter === "explore" && dest.hasItinerary) return false;
      return true;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === "price-asc") return a.startingPrice - b.startingPrice;
      if (sortBy === "price-desc") return b.startingPrice - a.startingPrice;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (a.hasItinerary !== b.hasItinerary) return a.hasItinerary ? -1 : 1;
      return a.startingPrice - b.startingPrice;
    });
  }, [
    categoryFilter,
    itineraryFilter,
    moodFilter,
    priceFilter,
    regionFilter,
    searchQuery,
    sortBy,
  ]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];

    if (searchQuery.trim()) {
      chips.push({
        key: "search",
        label: `"${searchQuery.trim()}"`,
        clear: () => setSearchQuery(""),
      });
    }
    if (categoryFilter !== "all") {
      chips.push({
        key: "category",
        label: getSubRegionChipLabel(categoryFilter, regionFilter),
        clear: () => setCategoryFilter("all"),
      });
    }
    if (regionFilter !== "all") {
      chips.push({
        key: "region",
        label: REGION_FILTERS.find((r) => r.id === regionFilter)?.label ?? regionFilter,
        clear: () => setRegionFilter("all"),
      });
    }
    if (moodFilter !== "all") {
      chips.push({
        key: "mood",
        label: MOOD_FILTERS.find((m) => m.id === moodFilter)?.label ?? moodFilter,
        clear: () => setMoodFilter("all"),
      });
    }
    if (priceFilter !== "all") {
      chips.push({
        key: "price",
        label: PRICE_FILTERS.find((p) => p.id === priceFilter)?.label ?? priceFilter,
        clear: () => setPriceFilter("all"),
      });
    }
    if (itineraryFilter !== "all") {
      chips.push({
        key: "itinerary",
        label: ITINERARY_FILTERS.find((i) => i.id === itineraryFilter)?.label ?? itineraryFilter,
        clear: () => setItineraryFilter("all"),
      });
    }
    return chips;
  }, [categoryFilter, itineraryFilter, moodFilter, priceFilter, regionFilter, searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setRegionFilter("all");
    setMoodFilter("all");
    setPriceFilter("all");
    setItineraryFilter("all");
    setSortBy("recommended");
  };

  const filteredByCategory = useMemo(() => {
    if (hasActiveFilters) return [];

    return destinationCategories
      .map((category) => ({
        ...category,
        destinations: category.destinations
          .map((dest) => allDestinations.find((d) => d.id === dest.id))
          .filter((dest): dest is (typeof allDestinations)[number] => !!dest),
      }))
      .filter((category) => category.destinations.length > 0);
  }, [hasActiveFilters]);

  return (
    <div className="pb-16 md:pb-20 pt-12 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            align="left"
            eyebrow="Worldwide Collection"
            title="Destinations"
            description="Explore curated regions — each destination opens a full day-by-day itinerary when available."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
              {primaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
              {secondaryCta.label}
            </MagneticButton>
          </div>

          <section
            className="mt-10 rounded-3xl border border-glass-border bg-surface/80 p-4 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)] sm:p-5"
            aria-label="Filter destinations"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search destinations</span>
                <Search
                  size={16}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by destination or region…"
                  className="w-full rounded-xl border border-glass-border bg-background/40 py-2.5 pr-4 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-gold/50"
                />
              </label>
              <p className="shrink-0 self-start rounded-full border border-gold/25 bg-gold/8 px-4 py-2 text-sm sm:self-center">
                <span className="font-medium text-gold">{filteredDestinations.length}</span>
                <span className="text-muted">
                  {" "}
                  {filteredDestinations.length === 1 ? "destination" : "destinations"}
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

            <div className="relative z-10 mt-4 grid gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <FilterDropdown
                id="region"
                label="Country"
                value={regionFilter}
                options={REGION_FILTERS.map((r) => ({
                  value: r.id,
                  label: r.label,
                  icon: Globe,
                }))}
                onChange={(value) => handleRegionFilterChange(value as RegionFilterId)}
                isOpen={openDropdown === "region"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
              <FilterDropdown
                id="collection"
                label={subRegionLabel}
                value={categoryFilter}
                options={subRegionOptions}
                onChange={setCategoryFilter}
                isOpen={openDropdown === "collection"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
              <FilterDropdown
                id="travel-style"
                label="Travel style"
                value={moodFilter}
                options={MOOD_FILTERS.map((m) => ({
                  value: m.id,
                  label: m.label,
                  icon: m.icon,
                }))}
                onChange={(value) => setMoodFilter(value as MoodFilterId)}
                isOpen={openDropdown === "travel-style"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
              <FilterDropdown
                id="budget"
                label="Budget"
                value={priceFilter}
                options={PRICE_FILTERS.map((p) => ({
                  value: p.id,
                  label: p.label,
                  icon: IndianRupee,
                }))}
                onChange={(value) => setPriceFilter(value as PriceFilterId)}
                isOpen={openDropdown === "budget"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
              <FilterDropdown
                id="journey-type"
                label="Journey type"
                value={itineraryFilter}
                options={ITINERARY_FILTERS.map((i) => ({
                  value: i.id,
                  label: i.label,
                  icon: Route,
                }))}
                onChange={(value) => setItineraryFilter(value as ItineraryFilterId)}
                isOpen={openDropdown === "journey-type"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
              <FilterDropdown
                id="sort"
                label="Sort by"
                value={sortBy}
                options={SORT_OPTIONS.map((s) => ({ value: s.id, label: s.label }))}
                onChange={(value) => setSortBy(value as SortId)}
                isOpen={openDropdown === "sort"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
            </div>
          </section>

          {filteredDestinations.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-glass-border bg-surface/60 px-6 py-16 text-center">
              <p className="font-display text-xl text-foreground">No destinations match your filters</p>
              <p className="mt-2 text-sm text-muted">
                Try a different collection, region, or travel style.
              </p>
              {hasActiveFilters && (
                <MagneticButton variant="secondary" className="mt-6" onClick={clearFilters}>
                  Clear all filters
                </MagneticButton>
              )}
            </div>
          ) : hasActiveFilters ? (
            <div className="mt-12">
              <DestinationGrid
                destinations={filteredDestinations.map((dest) => ({
                  id: dest.id,
                  name: dest.name,
                  location:
                    dest.region === "domestic" && dest.indiaRegion
                      ? (INDIA_REGION_FILTERS.find((region) => region.id === dest.indiaRegion)?.label ??
                        dest.categoryTitle)
                      : dest.categoryTitle,
                  description: dest.description,
                  image: dest.image,
                  startingPrice: dest.startingPrice,
                  hasItinerary: dest.hasItinerary,
                }))}
              />
            </div>
          ) : (
            <div className="mt-16 space-y-20">
              {filteredByCategory.map((category) => (
                <section key={category.id} id={category.id} className="scroll-mt-28">
                  <h2 className="font-display text-3xl text-foreground md:text-4xl">{category.title}</h2>
                  <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
                  <div className="mt-8">
                    <DestinationGrid
                      destinations={category.destinations.map((dest) => ({
                        id: dest.id,
                        name: dest.name,
                        location: category.title,
                        description: dest.description,
                        image: dest.image,
                        startingPrice: dest.startingPrice,
                        hasItinerary: dest.hasItinerary,
                      }))}
                    />
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
