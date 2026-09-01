"use client";

import { useState } from "react";
import Image from "next/image";
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

const DEFAULT_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

export function GalleryLazyImage({
  src,
  alt,
  className,
  aspectRatio = "4 / 5",
  priority = false,
  sizes = DEFAULT_SIZES,
}: GalleryLazyImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed || !src ? FALLBACK_IMAGE : src;

  return (
    <div
      className="gallery-lazy-image relative overflow-hidden bg-[color-mix(in_srgb,var(--foreground)_6%,var(--surface))]"
      style={{ aspectRatio }}
    >
      <Image
        key={imageSrc}
        src={imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        quality={75}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        onError={() => {
          if (!failed) setFailed(true);
        }}
        className={cn("object-cover", className)}
      />
    </div>
  );
}
