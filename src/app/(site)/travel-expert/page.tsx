import type { Metadata } from "next";
import { ConciergePage } from "@/components/concierge/ConciergePage";
import { getTravelExpertPageData } from "@/lib/api/travel-expert";

export const metadata: Metadata = {
  title: "Travel Expert",
  description: "Custom itineraries, visa assistance, private charter, and VIP travel services.",
};

export default async function Page() {
  const data = await getTravelExpertPageData();
  return <ConciergePage data={data} />;
}
