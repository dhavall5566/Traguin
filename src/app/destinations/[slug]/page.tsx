import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItineraryDetail } from "@/components/itineraries/ItineraryDetail";
import { DestinationDetail } from "@/components/destinations/DestinationDetail";
import { getAllDestinationIds, getDestinationById } from "@/lib/destinations";
import { getItineraryByDestinationId } from "@/lib/itineraries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllDestinationIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationById(slug);
  if (!destination) return { title: "Destination Not Found" };

  const itinerary = getItineraryByDestinationId(slug);
  if (itinerary) {
    return {
<<<<<<< HEAD
      title: itinerary.seo?.title ?? `${destination.name} — Luxury Itinerary`,
=======
      title: itinerary.seo?.title ?? `${destination.name}, Luxury Itinerary`,
>>>>>>> dhaval
      description: itinerary.seo?.description ?? itinerary.overview,
      openGraph: {
        title: itinerary.title,
        description: itinerary.tagline,
        images: [{ url: itinerary.heroImage }],
      },
    };
  }

  return {
<<<<<<< HEAD
    title: `${destination.name} — Luxury Destination`,
=======
    title: `${destination.name}, Luxury Destination`,
>>>>>>> dhaval
    description: destination.description,
    openGraph: { images: [{ url: destination.image }] },
  };
}

export default async function DestinationSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = getDestinationById(slug);
  if (!destination) notFound();

  const itinerary = getItineraryByDestinationId(slug);
  if (itinerary) {
    return <ItineraryDetail itinerary={itinerary} destinationName={destination.name} />;
  }

  return <DestinationDetail destination={destination} />;
}
