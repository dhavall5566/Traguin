"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { packages } from "@/data/packages";
import { formatPrice } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const featured = packages.filter((p) => p.featured);

export function FeaturedExperiences() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const ctx = gsap.context(() => {
      gsap.to(scroll, {
        x: () => -(scroll.scrollWidth - window.innerWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 20%",
          end: () => `+=${scroll.scrollWidth}`,
          pin: true,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-surface">
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

      <div ref={scrollRef} className="flex gap-6 px-6 pb-16 md:px-12">
        {featured.map((pkg) => (
          <article
            key={pkg.id}
            className="group relative w-[85vw] shrink-0 overflow-hidden rounded-3xl md:w-[450px]"
            style={{ transform: "perspective(1000px)" }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <SafeImage
                src={pkg.image}
                alt={`${pkg.title} — ${pkg.destination}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              <div className="absolute top-4 right-4 flex items-center gap-1 glass rounded-full px-3 py-1">
                <Star size={12} className="fill-gold text-gold" />
                <span className="text-xs text-foreground">{pkg.rating}</span>
              </div>
            </div>

            <div className="absolute bottom-0 w-full p-6 md:p-8">
              <p className="text-xs tracking-wide text-sand uppercase">{pkg.destination}</p>
              <h3 className="mt-1 font-display text-2xl text-foreground">{pkg.title}</h3>
              <p className="mt-1 text-sm text-muted">{pkg.duration}</p>

              <ul className="mt-4 space-y-1">
                {pkg.highlights.slice(0, 2).map((h) => (
                  <li key={h} className="text-xs text-muted">• {h}</li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Starting from</p>
                  <p className="font-display text-xl text-gold">{formatPrice(pkg.price)}</p>
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
    </section>
  );
}
