import type { Metadata } from "next";
import { GalleryPage } from "@/components/gallery/GalleryPage";
import { getGalleryPageData } from "@/lib/api/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Client photo walls, travel photography, and short films from TRAGUIN journeys.",
};

export default async function Page() {
  const data = await getGalleryPageData();
  return <GalleryPage {...data} />;
}
