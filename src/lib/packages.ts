import { destinations } from "@/data/destinations";
import type { TravelPackage } from "@/types";
import {
  getItineraryByPackageId,
  getItineraryReviewCount,
} from "@/lib/itineraries";

function packageHash(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getPackageReviewCount(pkg: TravelPackage): number {
  const itinerary = getItineraryByPackageId(pkg.id);
  if (itinerary) return getItineraryReviewCount(itinerary);

  const hash = packageHash(pkg.id);
  return 48 + (hash % 130) + Math.round(pkg.rating * 10);
}

export function getDestinationIdForPackage(pkg: TravelPackage): string | undefined {
  const match = destinations.find(
    (d) => d.name.toLowerCase() === pkg.destination.toLowerCase()
  );
  return match?.id;
}

<<<<<<< HEAD
/** Primary CTA for a package card — full itinerary when available, else destination listing. */
=======
/** Primary CTA for a package card, full itinerary when available, else destination listing. */
>>>>>>> dhaval
export function getPackageJourneyHref(pkg: TravelPackage): string {
  const itinerary = getItineraryByPackageId(pkg.id);
  if (itinerary) return `/destinations/${itinerary.destinationId}`;

  const destinationId = getDestinationIdForPackage(pkg);
  if (destinationId) return `/destinations/${destinationId}`;

  return "/destinations";
}
