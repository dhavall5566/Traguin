"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/images";

type GalleryLazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
};

export function GalleryLazyImage({
  src,
  alt,
  className,
  aspectRatio = "4 / 5",
  priority = false,
  sizes,
}: GalleryLazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div
      className="gallery-lazy-image relative overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_6%,var(--surface))]"
      style={{ aspectRatio }}
    >
      {!loaded ? (
        <div className="gallery-lazy-image__skeleton absolute inset-0" aria-hidden>
          <span className="gallery-lazy-image__spinner" />
        </div>
      ) : null}
      <img
        src={failed ? FALLBACK_IMAGE : currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed) {
            setFailed(true);
            setCurrentSrc(FALLBACK_IMAGE);
          }
          setLoaded(true);
        }}
        className={cn(
          "block h-full w-full object-cover transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}
