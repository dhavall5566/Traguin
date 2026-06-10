"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/providers/LenisContext";

/** Lock page scroll (and Lenis) while a modal/dialog is open; restore on close */
export function useModalScrollLock(locked: boolean) {
  const { lenis } = useLenis();

  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const routeAtLock = window.location.pathname + window.location.hash;
    const { style } = document.body;

    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    lenis?.stop();

    return () => {
      style.overflow = "";
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";

      const routeChanged = window.location.pathname + window.location.hash !== routeAtLock;

      if (routeChanged) {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, scrollY);
      }

      lenis?.start();
    };
  }, [locked, lenis]);
}
