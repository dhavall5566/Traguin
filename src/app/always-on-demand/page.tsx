import type { Metadata } from "next";
import { ConciergePage } from "@/components/concierge/ConciergePage";

export const metadata: Metadata = {
  title: "Always On Demand",
  description: "Your personal luxury travel concierge — available 24/7.",
};

export default function AlwaysOnDemandPage() {
  return <ConciergePage />;
}
