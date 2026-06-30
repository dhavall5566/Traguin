"use client";

import { useEffect, type ReactNode } from "react";
import { getMotionLite } from "@/lib/motion-profile";

export function MotionLiteProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      root.dataset.motionLite = getMotionLite() ? "true" : "false";
    };

    apply();

    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: coarse)"),
      window.matchMedia("(max-width: 767px)"),
    ];

    queries.forEach((query) => query.addEventListener("change", apply));
    window.addEventListener("resize", apply, { passive: true });

    return () => {
      queries.forEach((query) => query.removeEventListener("change", apply));
      window.removeEventListener("resize", apply);
    };
  }, []);

  return children;
}
