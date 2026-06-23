import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationsPage } from "@/components/destinations/DestinationsPage";
import { getDestinationsPageData } from "@/lib/api/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore luxury destinations across Asia, Europe, the Middle East, and beyond.",
};

export default async function Page() {
  const data = await getDestinationsPageData();

  return (
    <Suspense fallback={<div className="min-h-screen pt-24" aria-hidden />}>
      <DestinationsPage
        destinations={data.destinations}
        categories={data.categories}
        internationalCollectionFilters={data.internationalCollectionFilters}
        itineraryByDestinationSlug={Object.fromEntries(data.itineraryByDestinationSlug)}
      />
    </Suspense>
  );
}
