"use client";

import dynamic from "next/dynamic";

export const Globe = dynamic(
  () => import("./Globe").then((mod) => mod.Globe),
  { ssr: false, loading: () => <div className="h-full w-full bg-background" /> }
);

export type { GlobeMarker } from "./Globe";

export const LoadingGlobe = dynamic(
  () => import("./Globe").then((mod) => mod.LoadingGlobe),
  { ssr: false }
);

export const FloatingParticles = dynamic(
  () => import("./Particles").then((mod) => mod.FloatingParticles),
  { ssr: false }
);
