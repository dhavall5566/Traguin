"use client";

import { useMemo, useState } from "react";
import { filterGalleryItems, normalizeGalleryLabel } from "@/lib/gallery-types";
import type { GalleryCategory, GalleryItem } from "@/lib/gallery-types";
import { GalleryLazyImage } from "@/components/gallery/GalleryLazyImage";
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  className?: string;
  itemLimit?: number;
  items: GalleryItem[];
  categories: GalleryCategory[];
};

function GalleryArchiveCard({ item, priority }: { item: GalleryItem; priority: boolean }) {
  const showRegion =
    item.region.trim().length > 0 &&
    normalizeGalleryLabel(item.region) !== normalizeGalleryLabel(item.place);

  return (
    <figure className="gallery-archive-card group">
      <div className="gallery-archive-card__media">
        <GalleryLazyImage
          src={item.image}
          alt={item.alt || item.place}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          aspectRatio="4 / 5"
          priority={priority}
        />
        <div className="gallery-archive-card__scrim" aria-hidden />
        <figcaption className="gallery-archive-card__caption">
          <span className="gallery-archive-card__place">{item.place}</span>
          {showRegion ? (
            <span className="gallery-archive-card__region">{item.region}</span>
          ) : null}
        </figcaption>
      </div>
    </figure>
  );
}

export function GalleryGrid({ className, itemLimit, items, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const pool = itemLimit ? items.slice(0, itemLimit) : items;

  const visibleItems = useMemo(
    () => filterGalleryItems(pool, activeCategory),
    [activeCategory, pool],
  );

  const filterCategories =
    categories.length > 0 ? categories : [{ id: "all", label: "All" }];

  return (
    <div className={className}>
      {filterCategories.length > 1 && (
        <div className="gallery-filters -mx-1 overflow-x-auto px-1 pb-1">
          <div
            className="flex w-max min-w-full flex-wrap items-center gap-2 sm:gap-2.5"
            role="tablist"
            aria-label="Gallery categories"
          >
            {filterCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-[11px] sm:tracking-[0.2em]",
                    isActive
                      ? "bg-foreground text-background shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
                      : "border border-glass-border bg-surface text-muted hover:border-gold/30 hover:text-foreground",
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          Our visual archive is being curated. Check back soon for destination frames from recent
          journeys.
        </p>
      ) : (
        <>
          <div className="gallery-archive-grid mt-6 sm:mt-8">
            {visibleItems.map((item, index) => (
              <GalleryArchiveCard key={item.id} item={item} priority={index < 8} />
            ))}
          </div>

          {visibleItems.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted">
              No destinations in this collection yet. Try another filter.
            </p>
          )}
        </>
      )}
    </div>
  );
}
