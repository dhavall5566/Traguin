"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { getMotionLite } from "@/lib/motion-profile";
import { useMotionLite } from "@/hooks/useMotionLite";

gsap.registerPlugin(ScrollTrigger);

export type RevealVariant = "up" | "left" | "right" | "scale" | "flip";

type Reveal3DProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  as?: ElementType;
};

const variantFrom = {
  up: { y: 72, rotateX: 16, opacity: 0 },
  left: { x: -56, rotateY: 24, opacity: 0 },
  right: { x: 56, rotateY: -24, opacity: 0 },
  scale: { scale: 0.9, rotateX: 10, opacity: 0 },
  flip: { rotateX: -28, y: 40, opacity: 0 },
} as const;

function revealNow(el: HTMLElement) {
  gsap.set(el, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    clearProps: "transform",
  });
}

function isInRevealViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight * 0.92;
}

export function Reveal3D({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: Reveal3DProps) {
  const ref = useRef<HTMLElement>(null);
  const motionLite = useMotionLite();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (getMotionLite()) {
        revealNow(el);
        return;
      }

      const tween = gsap.fromTo(
        el,
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
          duration: 1.05,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (isInRevealViewport(el)) {
          tween.progress(1);
          revealNow(el);
        }
      });
    },
    { scope: ref }
  );

  if (motionLite) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref as never} className={cn("[transform-style:preserve-3d]", className)}>
      {children}
    </Tag>
  );
}

/** @deprecated Use Reveal3D, kept for itinerary imports */
export const ItineraryReveal3D = Reveal3D;
