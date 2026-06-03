import { redirect } from "next/navigation";

export default function LegacyItinerariesIndex() {
  redirect("/destinations");
}
