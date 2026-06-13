import { redirect } from "next/navigation";
import { getAllItinerarySlugs, getItineraryBySlug } from "@/lib/itineraries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllItinerarySlugs().map((slug) => ({ slug }));
}

/** Legacy /itineraries/[slug] URLs redirect to /destinations/[destinationId] */

export default async function LegacyItineraryRedirect({ params }: PageProps) {
  const { slug } = await params;
  const itinerary = getItineraryBySlug(slug);
  if (itinerary?.destinationId) {
    redirect(`/destinations/${itinerary.destinationId}`);
  }
  redirect("/destinations");
}
