import type { Metadata } from "next";
import { GalleryPage } from "@/components/gallery/GalleryPage";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Client photo walls, travel photography, and short films from TRAGUIN journeys.",
};

export default function Page() {
  return <GalleryPage />;
}
