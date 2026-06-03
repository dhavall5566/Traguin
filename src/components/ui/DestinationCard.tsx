"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";

type DestinationCardProps = {
  name: string;
  description: string;
  image: string;
  startingPrice?: number;
  href: string;
  cta?: string;
  duration?: string;
  className?: string;
};

export function DestinationCard({
  name,
  description,
  image,
  startingPrice,
  href,
  cta = "View Journey",
  duration,
  className,
}: DestinationCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-glass-border bg-surface transition-all duration-500 hover:border-gold/40 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
        <SafeImage
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />
        {duration && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] tracking-wide text-foreground uppercase">
            <Clock size={11} className="text-gold" />
            {duration}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-6">
          {startingPrice != null && (
            <div className="mb-3">
              <PriceDisplay amount={startingPrice} size="sm" />
            </div>
          )}
          <h3 className="font-display text-2xl text-foreground md:text-3xl">{name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted">{description}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.2em] text-gold uppercase transition-gap group-hover:gap-3">
            {cta}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
