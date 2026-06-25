"use client";

import { useEffect, useState } from "react";
import { getMotionLite } from "@/lib/motion-profile";

export function useMotionLite(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const update = () => setLite(getMotionLite());
    update();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    reduced.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  return lite;
}
