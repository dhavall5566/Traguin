import { Suspense } from "react";
import { DevChunkRecovery } from "@/components/providers/DevChunkRecovery";
import { GoogleAnalyticsLoader } from "@/components/analytics/GoogleAnalyticsLoader";
import { GoogleAnalyticsRouteTracker } from "@/components/analytics/GoogleAnalytics";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PlannerScrollHandler } from "@/components/providers/PlannerScrollHandler";
import { PageTransition } from "@/components/providers/PageTransitionProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { NikiAgent } from "@/components/layout/NikiAgent";
import { PageLoader } from "@/components/layout/PageLoader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalyticsLoader />
      <Suspense fallback={null}>
        <GoogleAnalyticsRouteTracker />
      </Suspense>
      <PageLoader />
      <DevChunkRecovery />
      <LenisProvider>
        <PlannerScrollHandler />
        <Navigation />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </LenisProvider>
      <NikiAgent />
    </>
  );
}
