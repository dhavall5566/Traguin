"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";
import { ItineraryReveal3D } from "@/components/itineraries/ItineraryReveal3D";
import { ItinerarySectionHeader } from "@/components/itineraries/ItinerarySectionHeader";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";

gsap.registerPlugin(ScrollTrigger);

type ItineraryGalleryMosaicProps = {
  images: string[];
  destination: string;
};

export function ItineraryGalleryMosaic({ images, destination }: ItineraryGalleryMosaicProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const tiles = grid.querySelectorAll("[data-gallery-tile]");
      gsap.fromTo(
        tiles,
        {
          y: 80,
          rotateX: 18,
          rotateY: (index) => (index % 2 === 0 ? -8 : 8),
          opacity: 0,
          scale: 0.94,
          transformPerspective: 1400,
          transformOrigin: "center bottom",
        },
        {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: gridRef }
  );

  if (images.length < 3) return null;

  const [hero, ...rest] = images;
  const secondary = rest.slice(0, 4);

  return (
    <section className="itinerary-section itinerary-section--compact overflow-hidden pt-0">
      <div className="site-container">
        <ItineraryReveal3D variant="left" className="mb-8 max-w-2xl md:mb-10">
          <ItinerarySectionHeader
            eyebrow="Visual journey"
            title={`${destination} in frame`}
            description="Landscapes, stays, and moments that define the pace and spirit of your journey."
          />
        </ItineraryReveal3D>

        <div
          ref={gridRef}
          className="itinerary-gallery grid gap-3 sm:gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-4 [perspective:1400px]"
        >
          <Tilt3DCard
            max={8}
            className="md:col-span-7 md:row-span-2 md:min-h-[28rem]"
          >
            <div
              data-gallery-tile
              className="group relative h-full overflow-hidden rounded-[1.25rem] [transform-style:preserve-3d]"
            >
              <SafeImage
                src={hero}
                alt={`${destination} journey highlight`}
                className="h-full min-h-[16rem] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] sm:min-h-[20rem] md:min-h-full"
                loading="lazy"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </Tilt3DCard>

          {secondary.map((src, index) => (
            <Tilt3DCard
              key={src}
              max={10}
              className={
                index === 0 ? "md:col-span-5" : index === 1 ? "md:col-span-3" : "md:col-span-2"
              }
            >
              <div
                data-gallery-tile
                className="group relative h-full overflow-hidden rounded-[1.25rem] [transform-style:preserve-3d]"
              >
                <SafeImage
                  src={src}
                  alt={`${destination} gallery ${index + 2}`}
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] md:aspect-auto md:min-h-[13rem]"
                  loading="lazy"
                />
              </div>
            </Tilt3DCard>
          ))}
        </div>
      </div>
    </section>
  );
}
