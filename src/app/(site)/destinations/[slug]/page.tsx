import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationJourneysHub } from "@/components/destinations/DestinationJourneysHub";
import { ItineraryDetail } from "@/components/itineraries/ItineraryDetail";
import { DestinationDetail } from "@/components/destinations/DestinationDetail";
import { getDestinationDetailData } from "@/lib/api/destinations";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ journey?: string }>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { journey } = await searchParams;
  const data = await getDestinationDetailData(slug, { journeySlug: journey });
  if (!data) return { title: "Destination Not Found" };

  const { destination, itinerary, journeys } = data;
  if (itinerary) {
    return {
      title: itinerary.seo?.title ?? `${itinerary.title} | ${destination.name}`,
      description: itinerary.seo?.description ?? itinerary.overview,
      openGraph: {
        title: itinerary.title,
        description: itinerary.tagline,
        images: [{ url: itinerary.heroImage }],
      },
    };
  }

  if (journeys.length > 1) {
    return {
      title: `${destination.name} Journeys`,
      description: `Choose from ${journeys.length} luxury journeys to ${destination.name}.`,
      openGraph: { images: [{ url: destination.image }] },
    };
  }

  return {
    title: `${destination.name}, Luxury Destination`,
    description: destination.description,
    openGraph: { images: [{ url: destination.image }] },
  };
}

export default async function DestinationSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { journey } = await searchParams;
  const data = await getDestinationDetailData(slug, { journeySlug: journey });
  if (!data) notFound();

  const { destination, itinerary, journeys, hotelsCatalog } = data;

  if (journeys.length > 1 && !itinerary) {
    return <DestinationJourneysHub destination={destination} journeys={journeys} />;
  }

  if (itinerary) {
    return (
      <ItineraryDetail
        itinerary={itinerary}
        destinationName={destination.name}
        hotelsCatalog={hotelsCatalog}
        backHref={journeys.length > 1 ? `/destinations/${slug}` : undefined}
        backLabel={journeys.length > 1 ? "All journeys" : undefined}
      />
    );
  }

  return <DestinationDetail destination={destination} hotelsCatalog={hotelsCatalog} />;
}
