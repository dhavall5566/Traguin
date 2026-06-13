"use client";

import { useEffect, useRef } from "react";

type UseTilt3DOptions = {
  max?: number;
  scale?: number;
  perspective?: number;
};

export function useTilt3D<T extends HTMLElement>({
  max = 10,
  scale = 1.02,
  perspective = 900,
}: UseTilt3DOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    el.style.transformStyle = "preserve-3d";
    el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      el.style.transform = `perspective(${perspective}px) rotateX(${-y * max}deg) rotateY(${x * max}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    const onLeave = () => {
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max, perspective, scale]);

  return ref;
}
