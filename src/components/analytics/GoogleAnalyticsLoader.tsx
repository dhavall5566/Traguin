"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID, isGoogleAnalyticsEnabled } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Loads GA outside the React tree (React 19 disallows `<script>` in component render). */
export function GoogleAnalyticsLoader() {
  useEffect(() => {
    if (!isGoogleAnalyticsEnabled() || !GA_MEASUREMENT_ID) return;
    if (document.querySelector(`script[data-traguin-ga="${GA_MEASUREMENT_ID}"]`)) return;

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: true });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.dataset.traguinGa = GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }, []);

  return null;
}
