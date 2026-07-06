import Script from "next/script";
import { GA_MEASUREMENT_ID, isGoogleAnalyticsEnabled } from "@/lib/analytics";

/** Server component — Next.js Script must not render inside client components (React 19). */
export function GoogleAnalyticsScripts() {
  if (!isGoogleAnalyticsEnabled() || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
