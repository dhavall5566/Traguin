"use client";

import { useState, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/images";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  className,
  onError,
  loading = "lazy",
  decoding = "async",
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img
      {...props}
      src={hasError ? fallbackSrc : currentSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn("block max-w-full", className)}
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        }
        onError?.(e);
      }}
    />
  );
}
