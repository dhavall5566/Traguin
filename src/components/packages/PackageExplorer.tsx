"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  Map,
  Heart,
  GitCompare,
  Star,
  Grid3X3,
} from "lucide-react";
import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { formatPrice } from "@/lib/utils";
import type { TravelMood, TravelPackage } from "@/types";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PackageDetailModal } from "@/components/packages/PackageDetailModal";

interface PackageExplorerProps {
  region: "domestic" | "international";
}

export function PackageExplorer({ region }: PackageExplorerProps) {
  const searchParams = useSearchParams();
  const destinationId = searchParams.get("destination");
  const destinationFilter = destinations.find((d) => d.id === destinationId)?.name ?? null;

  const [view, setView] = useState<"grid" | "map">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<TravelMood | "all">("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [detailPackage, setDetailPackage] = useState<TravelPackage | null>(null);

  const filtered = packages.filter(
    (p) =>
      p.region === region &&
      (!destinationFilter || p.destination === destinationFilter) &&
      (selectedMood === "all" || p.mood.includes(selectedMood)) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1]
  );

  const moods: (TravelMood | "all")[] = [
    "all",
    "luxury",
    "adventure",
    "romantic",
    "beach",
    "nature",
    "spiritual",
    "family",
  ];

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      {detailPackage && (
        <PackageDetailModal
          pkg={detailPackage}
          onClose={() => setDetailPackage(null)}
        />
      )}

      <div className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">
            {region === "domestic" ? "India" : "International"}
          </p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            {region === "domestic" ? "Domestic Packages" : "International Packages"}
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Explore our curated collection of luxury travel experiences, each crafted for the discerning traveler.
          </p>

          {destinationFilter && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="glass rounded-full px-4 py-2 text-xs text-foreground">
                Showing packages in {destinationFilter}
              </span>
              <Link
                href={`/packages/${region}`}
                className="text-xs text-gold transition-colors hover:text-gold-light"
              >
                Clear destination filter
              </Link>
            </div>
          )}

          {/* Filters */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <Filter size={16} className="text-gold" />
              <span className="text-xs text-muted">Filters</span>
            </div>

            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs capitalize transition-all",
                  selectedMood === mood
                    ? "bg-gold text-on-gold"
                    : "glass text-foreground hover:border-gold/30"
                )}
              >
                {mood}
              </button>
            ))}

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  view === "grid" ? "bg-gold text-on-gold" : "glass text-muted"
                )}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setView("map")}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  view === "map" ? "bg-gold text-on-gold" : "glass text-muted"
                )}
              >
                <Map size={18} />
              </button>
            </div>
          </div>

          {/* Price range */}
          <div className="mt-6 max-w-md">
            <label className="text-xs text-muted">
              Price: {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
            </label>
            <input
              type="range"
              min={0}
              max={500000}
              step={10000}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="mt-2 w-full accent-gold"
            />
          </div>

          {compare.length > 0 && (
            <div className="mt-6 glass rounded-xl p-4">
              <p className="text-sm text-gold">
                <GitCompare size={14} className="mr-2 inline" />
                {compare.length} package(s) selected for comparison
              </p>
            </div>
          )}

          {wishlist.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted">
              <Heart size={14} className="text-gold" fill="currentColor" />
              {wishlist.length} saved to wishlist
            </div>
          )}

          {/* Results */}
          {view === "grid" ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isWishlisted={wishlist.includes(pkg.id)}
                  isCompared={compare.includes(pkg.id)}
                  onWishlist={() => toggleWishlist(pkg.id)}
                  onCompare={() => toggleCompare(pkg.id)}
                  onViewDetails={() => setDetailPackage(pkg)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 glass rounded-3xl p-12 text-center">
              <Map size={48} className="mx-auto text-gold/30" />
              <p className="mt-4 text-muted">
                Interactive map view — {filtered.length} packages across{" "}
                {region === "domestic" ? "India" : "the world"}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {filtered.map((pkg) => (
                  <span key={pkg.id} className="glass rounded-full px-4 py-2 text-xs">
                    {pkg.destination}: {pkg.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="mt-20 text-center">
              <p className="text-muted">No packages match your filters.</p>
              <MagneticButton
                onClick={() => {
                  setSelectedMood("all");
                  setPriceRange([0, 500000]);
                }}
                variant="secondary"
                className="mt-4"
              >
                Reset Filters
              </MagneticButton>
              {destinationFilter && (
                <Link
                  href={`/packages/${region}`}
                  className="mt-4 block text-sm text-gold hover:text-gold-light"
                >
                  View all {region === "domestic" ? "domestic" : "international"} packages
                </Link>
              )}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href={region === "domestic" ? "/packages/international" : "/packages/domestic"} className="text-sm text-gold hover:text-gold-light">
              Explore {region === "domestic" ? "International" : "Domestic"} Packages →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  isWishlisted,
  isCompared,
  onWishlist,
  onCompare,
  onViewDetails,
}: {
  pkg: (typeof packages)[0];
  isWishlisted: boolean;
  isCompared: boolean;
  onWishlist: () => void;
  onCompare: () => void;
  onViewDetails: () => void;
}) {
  return (
    <article
      className="group relative overflow-hidden rounded-3xl glass transition-all duration-500 hover:border-gold/30 hover:-translate-y-2"
      style={{ transform: "perspective(1000px)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={pkg.image}
          alt={`${pkg.title} — ${pkg.destination}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onWishlist}
            className={cn(
              "rounded-full p-2 glass transition-colors",
              isWishlisted && "bg-gold/20 text-gold"
            )}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onCompare}
            className={cn(
              "rounded-full p-2 glass transition-colors",
              isCompared && "bg-gold/20 text-gold"
            )}
          >
            <GitCompare size={16} />
          </button>
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-1 glass rounded-full px-3 py-1">
          <Star size={12} className="fill-gold text-gold" />
          <span className="text-xs">{pkg.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs tracking-wide text-sand uppercase">{pkg.destination}</p>
        <h3 className="mt-1 font-display text-xl text-foreground">{pkg.title}</h3>
        <p className="mt-1 text-sm text-muted">{pkg.duration}</p>
        <ul className="mt-4 space-y-1">
          {pkg.highlights.map((h) => (
            <li key={h} className="text-xs text-muted">• {h}</li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">From</p>
            <p className="font-display text-lg text-gold">{formatPrice(pkg.price)}</p>
          </div>
          <MagneticButton
            onClick={onViewDetails}
            variant="secondary"
            className="!px-4 !py-2 !text-xs"
          >
            View Details
          </MagneticButton>
        </div>
      </div>
    </article>
  );
}
