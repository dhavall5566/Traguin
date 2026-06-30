"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { filterGalleryItems } from "@/lib/gallery-types";
import type { GalleryCategory, GalleryItem } from "@/lib/gallery-types";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import { getMotionLite } from "@/lib/motion-profile";

gsap.registerPlugin(ScrollTrigger);

type GalleryGridProps = {
  className?: string;
  itemLimit?: number;
  items: GalleryItem[];
  categories: GalleryCategory[];
};

function GalleryScrollTile({ item, index }: { item: GalleryItem; index: number }) {
  const tileRef = useRef<HTMLElement>(null);
  const tilt = index % 2 === 0 ? -6 : 6;

  useGSAP(
    () => {
      const tile = tileRef.current;
      if (!tile) return;

      if (getMotionLite()) {
        gsap.set(tile, { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        tile,
        {
          y: 56,
          rotateX: 12,
          rotateY: tilt,
          opacity: 0,
          scale: 0.97,
          transformPerspective: 1600,
          transformOrigin: "center bottom",
        },
        {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1.35,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 94%",
            once: true,
          },
        },
      );
    },
    { scope: tileRef, dependencies: [item.id, index] },
  );

  return (
    <figure
      ref={tileRef}
      className="gallery-tile-natural gallery-tile-natural--scroll-reveal group"
    >
      <div className="gallery-tile-natural__media">
        <SafeImage
          src={item.image}
          alt={item.alt || item.place}
          className="gallery-tile-natural__img transition-transform duration-[700ms] ease-out group-hover:scale-[1.015]"
          loading="lazy"
        />
      </div>
      <figcaption className="gallery-tile-natural__caption">
        <span className="gallery-tile-natural__label">{item.place}</span>
      </figcaption>
    </figure>
  );
}

export function GalleryGrid({ className, itemLimit, items, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const pool = itemLimit ? items.slice(0, itemLimit) : items;

  const visibleItems = useMemo(
    () => filterGalleryItems(pool, activeCategory),
    [activeCategory, pool],
  );

  useGSAP(
    () => {
      ScrollTrigger.refresh();
    },
    { dependencies: [activeCategory, visibleItems.length], scope: gridRef },
  );

  const filterCategories =
    categories.length > 0 ? categories : [{ id: "all", label: "All" }];

  return (
    <div className={className}>
      {filterCategories.length > 1 && (
        <div className="gallery-filters -mx-1 overflow-x-auto px-1 pb-1">
          <div
            className="flex w-max min-w-full flex-wrap items-center gap-2.5 sm:gap-3"
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
                    "shrink-0 rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300",
                    isActive
                      ? "bg-foreground text-background shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
                      : "bg-[color-mix(in_srgb,var(--foreground)_7%,var(--surface))] text-muted hover:bg-[color-mix(in_srgb,var(--foreground)_11%,var(--surface))] hover:text-foreground",
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
          <div
            ref={gridRef}
            key={activeCategory}
            className="gallery-intrinsic-grid gallery-intrinsic-grid--3d mt-8"
          >
            {visibleItems.map((item, index) => (
              <GalleryScrollTile key={`${item.id}-${index}`} item={item} index={index} />
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
