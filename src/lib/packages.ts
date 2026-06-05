import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import type { TravelPackage } from "@/types";
import { getItineraryByPackageId } from "@/lib/itineraries";

export function getPackagesForCity(cityName: string): TravelPackage[] {
  return packages.filter(
    (p) => p.destination.toLowerCase() === cityName.toLowerCase()
  );
}

export function getPackagesForCityId(cityId: string): TravelPackage[] {
  const nameMap: Record<string, string> = {
    bali: "Bali",
    dubai: "Dubai",
    switzerland: "Switzerland",
    thailand: "Thailand",
    vietnam: "Vietnam",
    singapore: "Singapore",
    japan: "Japan",
    maldives: "Maldives",
    mediterranean: "Mediterranean",
    "asia-pacific": "Asia Pacific",
    kerala: "Kerala",
    kashmir: "Kashmir",
    goa: "Goa",
    ladakh: "Ladakh",
  };
  const name = nameMap[cityId];
  return name ? getPackagesForCity(name) : [];
}

export function getDestinationIdForPackage(pkg: TravelPackage): string | undefined {
  const match = destinations.find(
    (d) => d.name.toLowerCase() === pkg.destination.toLowerCase()
  );
  return match?.id;
}

/** Primary CTA for a package card — full itinerary when available, else destination or package listing. */
export function getPackageJourneyHref(pkg: TravelPackage): string {
  const itinerary = getItineraryByPackageId(pkg.id);
  if (itinerary) return `/destinations/${itinerary.destinationId}`;

  const destinationId = getDestinationIdForPackage(pkg);
  if (destinationId) return `/destinations/${destinationId}`;

  return `/packages/${pkg.region}`;
}
