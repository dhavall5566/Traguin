"use client";

import { useMemo, useState } from "react";
import {
  filterGalleryItems,
  galleryCategories,
  galleryItems,
  type GalleryCategoryId,
  type GalleryItem,
} from "@/data/gallery";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  className?: string;
  itemLimit?: number;
};

type TileSpan = { colSpan: number; rowSpan: number };

/** Repeating 4-column pattern, every band sums to 4 cols × 2 rows with zero gaps */
const DESKTOP_SPANS: TileSpan[] = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
];

const MOBILE_SPANS: TileSpan[] = [
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
];

function tileSpan(index: number, variant: "desktop" | "mobile"): TileSpan {
  const pattern = variant === "desktop" ? DESKTOP_SPANS : MOBILE_SPANS;
  return pattern[index % pattern.length];
}

function GalleryTile({
  item,
  index,
}: {
  item: GalleryItem;
  index: number;
}) {
  const desktop = tileSpan(index, "desktop");
  const mobile = tileSpan(index, "mobile");

  return (
    <figure
      className="gallery-tile group"
      style={{
        animationDelay: `${index * 35}ms`,
        ["--gallery-col-span-mobile" as string]: mobile.colSpan,
        ["--gallery-row-span-mobile" as string]: mobile.rowSpan,
        ["--gallery-col-span-desktop" as string]: desktop.colSpan,
        ["--gallery-row-span-desktop" as string]: desktop.rowSpan,
      }}
    >
      <SafeImage
        src={item.image}
        alt={item.alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        loading="lazy"
      />

      <figcaption className="sr-only">
        {item.place}, {item.region}, {item.alt}
      </figcaption>
    </figure>
  );
}

export function GalleryGrid({ className, itemLimit }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>("all");

  const pool = itemLimit ? galleryItems.slice(0, itemLimit) : galleryItems;

  const visibleItems = useMemo(
    () => filterGalleryItems(pool, activeCategory),
    [activeCategory, pool]
  );

  return (
    <div className={className}>
      <div className="gallery-filters -mx-1 overflow-x-auto px-1 pb-1">
        <div
          className="flex w-max min-w-full flex-wrap items-center gap-2.5 sm:gap-3"
          role="tablist"
          aria-label="Gallery categories"
        >
          {galleryCategories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "shrink-0 rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300",
                  isActive
                    ? "bg-foreground text-background shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
                    : "bg-[color-mix(in_srgb,var(--foreground)_7%,var(--surface))] text-muted hover:bg-[color-mix(in_srgb,var(--foreground)_11%,var(--surface))] hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div key={activeCategory} className="gallery-mosaic mt-8">
        {visibleItems.map((item, index) => (
          <GalleryTile key={item.id} item={item} index={index} />
        ))}
      </div>

      {visibleItems.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted">
          No destinations in this collection yet. Try another filter.
        </p>
      )}
    </div>
  );
}
