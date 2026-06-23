import type { Metadata } from "next";
import { Suspense } from "react";
import { HotelDiscovery } from "@/components/hotels/HotelDiscovery";
import { getHotelsPageData } from "@/lib/api/hotels";

export const metadata: Metadata = {
  title: "Luxury Stays",
  description: "Handpicked luxury hotels, resorts, and private residences worldwide.",
};

export default async function Page() {
  const { hotels } = await getHotelsPageData();

  return (
    <Suspense fallback={null}>
      <HotelDiscovery hotels={hotels} />
    </Suspense>
  );
}
