import {
  destinationGalleries,
  getDestinationPrimaryImage,
  resolveDestinationHeroImage,
} from "@/data/destination-galleries";

export { getDestinationPrimaryImage, resolveDestinationHeroImage };

const GALLERY_SIZE = 5;

/** Five unique destination photos, curated gallery only (no itinerary cross-merge) */
export function getDestinationGalleryImages(
  destinationId: string,
  fallback?: string,
  cmsGallery?: string[]
): string[] {
  if (cmsGallery?.length) {
    return [...cmsGallery].slice(0, GALLERY_SIZE);
  }
  const slug = destinationId;
  const curated = destinationGalleries[slug];
  if (curated?.length) {
    return [...curated].slice(0, GALLERY_SIZE);
  }
  return fallback ? [fallback] : [];
}
