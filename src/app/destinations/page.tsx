import type { Metadata } from "next";
import { DestinationsPage } from "@/components/destinations/DestinationsPage";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore luxury destinations across Asia, Europe, the Middle East, and beyond.",
};

export default function Page() {
  return <DestinationsPage />;
}
