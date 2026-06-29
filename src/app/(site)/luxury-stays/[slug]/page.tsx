import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HotelDetailPage } from "@/components/hotels/HotelDetailPage";
import { getHotelDetailData } from "@/lib/api/hotels";
import { isLuxuryStaysVisible } from "@/lib/site-features";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getHotelDetailData(slug);
  if (!data) return { title: "Hotel Not Found" };

  const { hotel } = data;
  const destination = hotel.destination?.trim();
  return {
    title: `${hotel.name} | Luxury Stay`,
    description:
      hotel.description ??
      (destination ? `Luxury stay in ${destination}.` : `Luxury stay at ${hotel.name}.`),
    openGraph: {
      title: hotel.name,
      description: hotel.description,
      images: [{ url: hotel.image }],
    },
  };
}

export default async function HotelSlugPage({ params }: PageProps) {
  if (!isLuxuryStaysVisible()) {
    redirect("/");
  }

  const { slug } = await params;
  const data = await getHotelDetailData(slug);
  if (!data) notFound();

  return <HotelDetailPage hotel={data.hotel} allHotels={data.allHotels} />;
}
