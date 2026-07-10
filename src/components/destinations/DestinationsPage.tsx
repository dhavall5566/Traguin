"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Route,
  type LucideIcon,
} from "lucide-react";
import type {
  DestinationItineraryPreview,
  DestinationListing,
  DestinationPackagePreview,
} from "@/lib/destination-listing-types";
import { INDIA_REGION_FILTERS } from "@/lib/destination-listing-types";
import {
  buildDestinationDisplaySections,
  destinationCountryLabel,
  isIndiaSubregionFilter,
  matchesDestinationSubregion,
  totalPackagesInDestinations,
} from "@/lib/destination-grouping";
import { DestinationRegionAccordion } from "@/components/destinations/DestinationRegionAccordion";
import { DestinationListingCard } from "@/components/ui/DestinationListingCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { FilterBudgetRange } from "@/components/ui/FilterBudgetRange";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { getDestinationsHeroContent, curatedDestinationCount } from "@/data/pageContent";
import {
  BUDGET_SLIDER_MAX,
  BUDGET_SLIDER_MIN,
  formatInrBudgetRange,
  isFullBudgetRange,
  matchesDestinationPriceRange,
} from "@/data/price-ranges";
import type { TravelMood } from "@/types";

const REGION_FILTERS = [
  { id: "all", label: "All destinations" },
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
  { id: "all", label: "All experiences" },
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

type RegionFilterId = (typeof REGION_FILTERS)[number]["id"];
type MoodFilterId = (typeof MOOD_FILTERS)[number]["id"];
type ItineraryFilterId = (typeof ITINERARY_FILTERS)[number]["id"];
type SortId = (typeof SORT_OPTIONS)[number]["id"];

type DestinationsPageProps = {
  destinations: DestinationListing[];
  internationalCountryFilters: { id: string; label: string }[];
  itineraryByDestinationSlug: Record<string, DestinationItineraryPreview>;
  journeysByDestinationSlug: Record<string, DestinationPackagePreview[]>;
};

function buildInternationalCountryOptions(
  internationalCountryFilters: { id: string; label: string }[]
) {
  return [
    { value: "all", label: "All countries", icon: Globe },
    ...internationalCountryFilters.map((country) => ({
      value: country.id,
      label: country.label,
      icon: MapPin,
    })),
  ];
}

const INDIA_REGION_OPTIONS = [
  { value: "all", label: "All regions", icon: Globe },
  ...INDIA_REGION_FILTERS.filter((region) => region.id !== "all").map((region) => ({
    value: region.id,
    label: region.label,
    icon: MapPin,
  })),
];

function getSubRegionLabel(regionFilter: RegionFilterId) {
  if (regionFilter === "domestic") return "Region";
  if (regionFilter === "international") return "Country";
  return "Region / Country";
}

function getSubRegionOptions(
  regionFilter: RegionFilterId,
  internationalCountryOptions: ReturnType<typeof buildInternationalCountryOptions>
) {
  if (regionFilter === "domestic") return INDIA_REGION_OPTIONS;
  if (regionFilter === "international") return internationalCountryOptions;

  return [
    { value: "all", label: "All regions & countries", icon: Globe },
    ...INDIA_REGION_FILTERS.filter((region) => region.id !== "all").map((region) => ({
      value: region.id,
      label: region.label,
      icon: MapPin,
    })),
    ...internationalCountryOptions.filter((option) => option.value !== "all"),
  ];
}

function matchesSubRegionFilter(
  dest: DestinationListing,
  categoryFilter: string,
  regionFilter: RegionFilterId
) {
  if (categoryFilter === "all") return true;
  if (regionFilter === "all") {
    return matchesDestinationSubregion(dest, categoryFilter, regionFilter);
  }
  return matchesDestinationSubregion(dest, categoryFilter, regionFilter);
}

function getSubRegionChipLabel(
  categoryFilter: string,
  regionFilter: RegionFilterId,
  internationalCountryFilters: { id: string; label: string }[]
) {
  if (isIndiaSubregionFilter(categoryFilter)) {
    return INDIA_REGION_FILTERS.find((region) => region.id === categoryFilter)?.label ?? categoryFilter;
  }
  return (
    internationalCountryFilters.find((country) => country.id === categoryFilter)?.label ??
    categoryFilter
  );
}

function listingRegionLabel(dest: DestinationListing): string {
  if (dest.region === "domestic") {
    const region = dest.indiaRegion
      ? INDIA_REGION_FILTERS.find((item) => item.id === dest.indiaRegion)?.label
      : undefined;
    return region ? `${region} · India` : "India";
  }
  return destinationCountryLabel(dest) ?? "International";
}

function toGridDestination(dest: DestinationListing) {
  return {
    id: dest.id,
    name: dest.name,
    location: dest.name,
    region: dest.region,
    regionLabel: listingRegionLabel(dest),
    description: dest.description,
    image: dest.image,
    galleryImages: dest.galleryImages,
    startingPrice: dest.startingPrice,
    hasItinerary: dest.hasItinerary,
    journeyCount: dest.journeyCount,
  };
}

type DestinationGridItem = ReturnType<typeof toGridDestination> & {
  key: string;
  href: string;
  cta: string;
  duration?: string;
  rating: number;
};

function expandDestinationsForGrid(
  destinations: ReturnType<typeof toGridDestination>[],
  itineraryByDestinationSlug: Record<string, DestinationItineraryPreview>,
  journeysByDestinationSlug: Record<string, DestinationPackagePreview[]>,
): DestinationGridItem[] {
  const items: DestinationGridItem[] = [];

  for (const dest of destinations) {
    const isInternationalHub = dest.region === "international" && dest.journeyCount > 1;
    const journeys = journeysByDestinationSlug[dest.id] ?? [];

    if (isInternationalHub && journeys.length > 0) {
      for (const journey of journeys) {
        items.push({
          ...dest,
          key: `${dest.id}-${journey.slug}`,
          name: journey.title,
          location: journey.destination,
          description: journey.highlights.slice(0, 3).join(" "),
          image: journey.heroImage,
          startingPrice: journey.startingPrice,
          href: `/destinations/${dest.id}?journey=${encodeURIComponent(journey.slug)}`,
          cta: "View Itinerary",
          duration: journey.duration,
          rating: 5,
          journeyCount: 1,
        });
      }
      continue;
    }

    const isHub = dest.journeyCount > 1;
    const itinerary = !isHub ? itineraryByDestinationSlug[dest.id] : undefined;

    items.push({
      ...dest,
      key: dest.id,
      name: dest.name,
      location: itinerary?.destination ?? dest.location,
      description: isHub
        ? dest.description
        : itinerary
          ? itinerary.highlights.slice(0, 3).join(" ")
          : dest.description,
      image: isHub ? dest.image : (itinerary?.heroImage ?? dest.image),
      startingPrice: isHub ? dest.startingPrice : (itinerary?.startingPrice ?? dest.startingPrice),
      href: `/destinations/${dest.id}`,
      cta: isHub ? "Browse journeys" : dest.hasItinerary ? "View Itinerary" : "View Destination",
      duration: isHub ? undefined : itinerary?.duration,
      rating: dest.hasItinerary && !isHub ? 5 : 4,
      journeyCount: dest.journeyCount,
    });
  }

  return items;
}

function DestinationGroupedSections({
  sections,
  itineraryByDestinationSlug,
  journeysByDestinationSlug,
}: {
  sections: ReturnType<typeof buildDestinationDisplaySections>;
  itineraryByDestinationSlug: Record<string, DestinationItineraryPreview>;
  journeysByDestinationSlug: Record<string, DestinationPackagePreview[]>;
}) {
  return (
    <div className="mt-16 space-y-24">
      {sections.map((section) => (
        <section key={section.id} id={`destinations-${section.id}`} className="scroll-mt-28">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
              {section.id === "domestic" ? "Indian packages" : "International packages"}
            </p>
            <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">{section.title}</h2>
            <p className="mt-3 text-muted">{section.description}</p>
          </div>

          <DestinationRegionAccordion
            sectionId={section.id}
            items={section.subgroups.map((subgroup) => ({
              id: subgroup.id,
              title: subgroup.title,
              packageCount: totalPackagesInDestinations(subgroup.destinations),
              content: (
                <DestinationGrid
                  destinations={subgroup.destinations.map(toGridDestination)}
                  itineraryByDestinationSlug={itineraryByDestinationSlug}
                  journeysByDestinationSlug={journeysByDestinationSlug}
                />
              ),
            }))}
          />
        </section>
      ))}
    </div>
  );
}

function DestinationGrid({
  destinations,
  itineraryByDestinationSlug,
  journeysByDestinationSlug,
}: {
  destinations: ReturnType<typeof toGridDestination>[];
  itineraryByDestinationSlug: Record<string, DestinationItineraryPreview>;
  journeysByDestinationSlug: Record<string, DestinationPackagePreview[]>;
}) {
  const gridItems = expandDestinationsForGrid(
    destinations,
    itineraryByDestinationSlug,
    journeysByDestinationSlug,
  );

  return (
    <div className="destination-grid grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
      {gridItems.map((dest) => (
        <DestinationListingCard
          key={dest.key}
          destinationId={dest.id}
          name={dest.name}
          location={dest.location}
          regionLabel={dest.regionLabel}
          description={dest.description}
          image={dest.image}
          galleryImages={dest.galleryImages}
          startingPrice={dest.startingPrice}
          href={dest.href}
          cta={dest.cta}
          duration={dest.duration}
          rating={dest.rating}
          journeyCount={dest.journeyCount}
        />
      ))}
    </div>
  );
}

function parseRegionParam(value: string | null): RegionFilterId {
  if (value === "domestic" || value === "international") return value;
  return "all";
}

export function DestinationsPage({
  destinations,
  internationalCountryFilters,
  itineraryByDestinationSlug,
  journeysByDestinationSlug,
}: DestinationsPageProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilterId>(() =>
    parseRegionParam(searchParams.get("region"))
  );
  const [moodFilter, setMoodFilter] = useState<MoodFilterId>("all");
  const [budgetMin, setBudgetMin] = useState(BUDGET_SLIDER_MIN);
  const [budgetMax, setBudgetMax] = useState(BUDGET_SLIDER_MAX);
  const [itineraryFilter, setItineraryFilter] = useState<ItineraryFilterId>("all");
  const [sortBy, setSortBy] = useState<SortId>("recommended");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setRegionFilter(parseRegionParam(searchParams.get("region")));
  }, [searchParams]);

  const activateSiblingFilter = useCallback((targetId: string) => {
    setOpenDropdown(targetId);
    window.requestAnimationFrame(() => {
      document.getElementById(`${targetId}-trigger`)?.focus({ preventScroll: true });
    });
  }, []);

  const internationalCountryOptions = useMemo(
    () => buildInternationalCountryOptions(internationalCountryFilters),
    [internationalCountryFilters]
  );

  const subRegionOptions = useMemo(
    () => getSubRegionOptions(regionFilter, internationalCountryOptions),
    [internationalCountryOptions, regionFilter]
  );

  const subRegionLabel = getSubRegionLabel(regionFilter);

  const handleRegionFilterChange = (value: RegionFilterId) => {
    setRegionFilter(value);
    setCategoryFilter("all");
  };

  const budgetFilterActive = !isFullBudgetRange(budgetMin, budgetMax);

  const prefersGroupedLayout =
    !searchQuery.trim() &&
    moodFilter === "all" &&
    !budgetFilterActive &&
    itineraryFilter === "all" &&
    sortBy === "recommended";

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    categoryFilter !== "all" ||
    regionFilter !== "all" ||
    moodFilter !== "all" ||
    budgetFilterActive ||
    itineraryFilter !== "all" ||
    sortBy !== "recommended";

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matches = destinations.filter((dest) => {
      if (query) {
        const indiaArea =
          dest.indiaRegion &&
          INDIA_REGION_FILTERS.find((region) => region.id === dest.indiaRegion)?.label;
        const country = destinationCountryLabel(dest);
        const haystack = `${dest.name} ${dest.description} ${dest.categoryTitle} ${indiaArea ?? ""} ${country ?? ""} ${dest.categories
          .map((c) => c.title)
          .join(" ")}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (!matchesSubRegionFilter(dest, categoryFilter, regionFilter)) return false;
      if (regionFilter !== "all" && dest.region !== regionFilter) return false;
      if (moodFilter !== "all" && !dest.moods.includes(moodFilter)) return false;
      if (!matchesDestinationPriceRange(dest.startingPrice, budgetMin, budgetMax)) return false;
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
    destinations,
    itineraryFilter,
    moodFilter,
    budgetMax,
    budgetMin,
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
        label: getSubRegionChipLabel(categoryFilter, regionFilter, internationalCountryFilters),
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
    if (budgetFilterActive) {
      chips.push({
        key: "price",
        label: formatInrBudgetRange(budgetMin, budgetMax),
        clear: () => {
          setBudgetMin(BUDGET_SLIDER_MIN);
          setBudgetMax(BUDGET_SLIDER_MAX);
        },
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
  }, [
    budgetFilterActive,
    budgetMax,
    budgetMin,
    categoryFilter,
    internationalCountryFilters,
    itineraryFilter,
    moodFilter,
    regionFilter,
    searchQuery,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setRegionFilter("all");
    setMoodFilter("all");
    setBudgetMin(BUDGET_SLIDER_MIN);
    setBudgetMax(BUDGET_SLIDER_MAX);
    setItineraryFilter("all");
    setSortBy("recommended");
  };

  const displaySections = useMemo(() => {
    if (!prefersGroupedLayout || filteredDestinations.length === 0) return [];
    return buildDestinationDisplaySections(filteredDestinations, {
      region: regionFilter,
      subregionId: categoryFilter !== "all" ? categoryFilter : undefined,
    });
  }, [categoryFilter, filteredDestinations, prefersGroupedLayout, regionFilter]);

  const heroContent = useMemo(
    () => getDestinationsHeroContent(regionFilter),
    [regionFilter]
  );

  return (
    <>
      <PageHero {...heroContent} />
      <TrustBar />
      <PageShell noPaddingTop>
          <section
            className="page-filter-panel mt-2"
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
                <span className="font-medium text-gold">{curatedDestinationCount}</span>
                <span className="text-muted"> destinations</span>
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
                label="Destination"
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
              <FilterBudgetRange
                id="budget"
                label="Price range"
                valueMin={budgetMin}
                valueMax={budgetMax}
                onChange={(min, max) => {
                  setBudgetMin(min);
                  setBudgetMax(max);
                }}
                isOpen={openDropdown === "budget"}
                onToggle={setOpenDropdown}
                siblingIds={[...DESTINATION_FILTER_IDS]}
                onActivateSibling={activateSiblingFilter}
              />
              <FilterDropdown
                id="journey-type"
                label="Experience type"
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
                Try a different region, country, or travel style.
              </p>
              {hasActiveFilters && (
                <MagneticButton variant="secondary" className="mt-6" onClick={clearFilters}>
                  Clear all filters
                </MagneticButton>
              )}
            </div>
          ) : prefersGroupedLayout && displaySections.length > 0 ? (
            <DestinationGroupedSections
              sections={displaySections}
              itineraryByDestinationSlug={itineraryByDestinationSlug}
              journeysByDestinationSlug={journeysByDestinationSlug}
            />
          ) : (
            <div className="mt-12">
              <DestinationGrid
                destinations={filteredDestinations.map(toGridDestination)}
                itineraryByDestinationSlug={itineraryByDestinationSlug}
                journeysByDestinationSlug={journeysByDestinationSlug}
              />
            </div>
          )}
        <PageCTA />
      </PageShell>
    </>
  );
}
