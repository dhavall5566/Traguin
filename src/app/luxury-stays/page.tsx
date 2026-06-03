import type { Metadata } from "next";
import { HotelDiscovery } from "@/components/hotels/HotelDiscovery";

export const metadata: Metadata = {
  title: "Luxury Stays",
  description: "Handpicked luxury hotels, resorts, and private residences worldwide.",
};

export default function Page() {
  return <HotelDiscovery />;
}
