"use client";

import { installThreeConsoleFilter } from "@/lib/r3fClock";

installThreeConsoleFilter();

/** Loads Three.js console filter before any Canvas mounts. */
export function ThreeInit() {
  return null;
}
