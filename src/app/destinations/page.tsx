import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsPage } from "@/components/destinations/DestinationsPage";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore luxury destinations across Asia, Europe, the Middle East, and beyond.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24" aria-hidden />}>
      <DestinationsPage />
    </Suspense>
  );
}
