import { packages } from "@/data/packages";
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
