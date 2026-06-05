import type { Metadata } from "next";
import { Suspense } from "react";
import { HotelDiscovery } from "@/components/hotels/HotelDiscovery";

export const metadata: Metadata = {
  title: "Luxury Hotels",
  description: "Discover handpicked luxury hotels and premium accommodations worldwide.",
};

export default function HotelsPage() {
  return (
    <Suspense fallback={null}>
      <HotelDiscovery />
    </Suspense>
  );
}
