"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import { destinations } from "@/data/destinations";
import { getPackagesForCityId } from "@/lib/packages";
import type { GlobeMarker } from "@/components/three/Globe";
import { CityPackagesPanel } from "@/components/globe/CityPackagesPanel";

const Globe = dynamic(
  () => import("@/components/three").then((m) => m.Globe),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-background" />
    ),
  }
);

const FloatingParticles = dynamic(
  () => import("@/components/three").then((m) => m.FloatingParticles),
  { ssr: false }
);

export function HeroSection() {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState<GlobeMarker | null>(null);

  const markers: GlobeMarker[] = useMemo(
    () =>
      destinations.map((d) => {
        const cityPackages = getPackagesForCityId(d.id);
        return {
          id: d.id,
          name: d.name,
          lat: d.lat,
          lng: d.lng,
          packageCount: cityPackages.length || d.packageCount,
          region: d.region,
          country: d.country,
        };
      }),
    []
  );

  const cityPackages = activeCity ? getPackagesForCityId(activeCity.id) : [];

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <h1 className="sr-only">Traguin — Extraordinary luxury journeys crafted for you</h1>
      <div className="absolute inset-0 bg-background" />
      <div className="hero-glow absolute inset-0" />

      <div className="absolute inset-x-0 bottom-0 top-16 md:top-20">
        <Globe
          autoRotate
          interactive
          scale={1.0}
          cameraDistance={6.1}
          markers={markers}
          onMarkerClick={setActiveCity}
        />
      </div>

      <FloatingParticles className="pointer-events-none absolute inset-0 opacity-20" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60" />

      {activeCity && (
        <CityPackagesPanel
          city={activeCity}
          packages={cityPackages}
          onClose={() => setActiveCity(null)}
          onPackageClick={() => {
            if (activeCity) router.push(`/destinations/${activeCity.id}`);
          }}
        />
      )}

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-sand/80">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="animate-bounce" size={18} />
        </div>
      </div>
    </section>
  );
}
