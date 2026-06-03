import { packages } from "@/data/packages";
import { destinations } from "@/data/destinations";
import type { TravelPackage } from "@/types";

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
