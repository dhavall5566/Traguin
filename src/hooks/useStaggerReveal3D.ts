"use client";

import { type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RevealVariant } from "@/components/ui/Reveal3D";

gsap.registerPlugin(ScrollTrigger);

const variantFrom = {
  up: { y: 64, rotateX: 14, opacity: 0 },
  left: { x: -48, rotateY: 20, opacity: 0 },
  right: { x: 48, rotateY: -20, opacity: 0 },
  scale: { scale: 0.92, rotateX: 8, opacity: 0 },
  flip: { rotateX: -24, y: 36, opacity: 0 },
} as const;

type UseStaggerReveal3DOptions = {
  selector?: string;
  stagger?: number;
  variant?: RevealVariant;
  start?: string;
};

export function useStaggerReveal3D(
  containerRef: RefObject<HTMLElement | null>,
  {
    selector = "[data-reveal-item]",
    stagger = 0.1,
    variant = "up",
    start = "top 85%",
  }: UseStaggerReveal3DOptions = {}
) {
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const items = container.querySelectorAll(selector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          ...variantFrom[variant],
          transformPerspective: 1200,
          transformOrigin: variant === "flip" ? "center top" : "center bottom",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
          duration: 0.9,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start,
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );
}
