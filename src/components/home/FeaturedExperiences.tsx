"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { packages } from "@/data/packages";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

const featured = packages.filter((p) => p.featured);
const marqueeItems = [...featured, ...featured];

export function FeaturedExperiences() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="section-padding pb-8">
        <div className="mx-auto flex max-w-7xl items-end justify-between">
          <div>
            <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Curated Collection</p>
            <h2 className="font-display text-4xl text-foreground md:text-6xl">
              Featured Experiences
            </h2>
          </div>
          <Link
            href="/packages/international"
            className="hidden items-center gap-2 text-sm text-gold transition-colors hover:text-gold-light md:flex"
            data-cursor="pointer"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden pb-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent md:w-24" />

        <div className="featured-experiences-track flex w-max gap-6 px-6 md:px-12">
          {marqueeItems.map((pkg, i) => (
            <article
              key={`${pkg.id}-${i}`}
              className="group relative w-[85vw] shrink-0 overflow-hidden rounded-3xl md:w-[450px]"
              style={{ transform: "perspective(1000px)" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <SafeImage
                  src={pkg.image}
                  alt={`${pkg.title} — ${pkg.destination}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="card-image-scrim absolute inset-0" aria-hidden />

                <div className="absolute top-4 right-4 z-[1] flex items-center gap-1 glass rounded-full px-3 py-1">
                  <Star size={12} className="fill-gold text-gold" />
                  <span className="text-xs text-foreground">{pkg.rating}</span>
                </div>
              </div>

              <div className="absolute bottom-0 z-[1] w-full p-6 md:p-8">
                <p className="text-xs tracking-wide text-sand uppercase">{pkg.destination}</p>
                <h3 className="mt-1 font-display text-2xl text-white">{pkg.title}</h3>
                <p className="mt-1 text-sm text-white/80">{pkg.duration}</p>

                <ul className="mt-4 space-y-1">
                  {pkg.highlights.slice(0, 2).map((h) => (
                    <li key={h} className="text-xs text-white/75">
                      • {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="card-price-badge shrink-0">
                    <PriceDisplay
                      amount={pkg.price}
                      label="Starting from"
                      size="md"
                      variant="overlay"
                    />
                  </div>
                  <MagneticButton
                    as="a"
                    href={`/packages/${pkg.region}`}
                    variant="secondary"
                    className="!px-5 !py-2.5 !text-xs"
                  >
                    Explore
                  </MagneticButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="section-padding pt-0 pb-16 text-center md:hidden">
        <Link
          href="/packages/international"
          className="inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-light"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
