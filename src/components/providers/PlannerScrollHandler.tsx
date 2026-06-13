"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "@/components/providers/LenisContext";
import {
  clearPlannerScrollPending,
  consumePlannerScrollPending,
  isHomeHref,
  isPlannerHref,
  markPlannerScrollPending,
  scrollToHomeTop,
  scrollToPlannerSection,
} from "@/lib/scroll-to-planner";

export function PlannerScrollHandler() {
  const { lenis } = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  const scrollToPlanner = useCallback(() => {
    scrollToPlannerSection(lenis);
  }, [lenis]);

  useEffect(() => {
    if (pathname !== "/") {
      clearPlannerScrollPending();
      return;
    }

    if (!consumePlannerScrollPending()) return;

    const timers = [0, 120, 350, 700, 1200, 2000, 3200].map((delay) =>
      window.setTimeout(scrollToPlanner, delay)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname, scrollToPlanner]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement).closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (isPlannerHref(href)) {
        event.preventDefault();
        clearPlannerScrollPending();
        markPlannerScrollPending();

        if (pathname === "/") {
          if (window.location.hash) {
            window.history.replaceState(null, "", "/");
          }
          scrollToPlanner();
          return;
        }

        router.push("/");
        return;
      }

      if (isHomeHref(href)) {
        clearPlannerScrollPending();
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
        if (pathname === "/") {
          event.preventDefault();
          scrollToHomeTop(lenis);
        }
        return;
      }

      clearPlannerScrollPending();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router, scrollToPlanner, lenis]);

  return null;
}
