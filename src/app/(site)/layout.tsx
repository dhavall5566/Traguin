import { Suspense } from "react";
import { DevChunkRecovery } from "@/components/providers/DevChunkRecovery";
import { GoogleAnalyticsRouteTracker } from "@/components/analytics/GoogleAnalytics";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PlannerScrollHandler } from "@/components/providers/PlannerScrollHandler";
import { PageTransition } from "@/components/providers/PageTransitionProvider";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { NikiAgent } from "@/components/layout/NikiAgent";
import { CmsLiveReload } from "@/components/providers/CmsLiveReload";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalyticsRouteTracker />
      </Suspense>
      <DevChunkRecovery />
      <CmsLiveReload />
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
