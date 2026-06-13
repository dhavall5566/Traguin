import { destinationGalleries } from "@/data/destination-galleries";

const GALLERY_SIZE = 5;

<<<<<<< HEAD
/** Five unique destination photos — curated gallery only (no itinerary cross-merge) */
=======
/** Five unique destination photos, curated gallery only (no itinerary cross-merge) */
>>>>>>> dhaval
export function getDestinationGalleryImages(
  destinationId: string,
  fallback?: string
): string[] {
  const curated = destinationGalleries[destinationId];
  if (curated?.length) {
    return [...curated].slice(0, GALLERY_SIZE);
  }
  return fallback ? [fallback] : [];
}
