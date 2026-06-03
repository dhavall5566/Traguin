import type { Metadata } from "next";
import { ConciergePage } from "@/components/concierge/ConciergePage";

export const metadata: Metadata = {
  title: "Travel Concierge",
  description: "Custom itineraries, visa assistance, private charter, and VIP travel services.",
};

export default function Page() {
  return <ConciergePage />;
}
