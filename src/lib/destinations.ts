import { destinationCategories, type DestinationCategory } from "@/data/destinationCategories";

export type DestinationListing = {
  id: string;
  name: string;
  description: string;
  image: string;
  startingPrice: number;
  categoryId: string;
  categoryTitle: string;
};

export function getAllDestinations(): DestinationListing[] {
  const seen = new Set<string>();
  const list: DestinationListing[] = [];

  for (const category of destinationCategories) {
    for (const dest of category.destinations) {
      if (seen.has(dest.id)) continue;
      seen.add(dest.id);
      list.push({
        ...dest,
        categoryId: category.id,
        categoryTitle: category.title,
      });
    }
  }

  return list;
}

export function getDestinationById(id: string): DestinationListing | undefined {
  return getAllDestinations().find((d) => d.id === id);
}

export function getAllDestinationIds(): string[] {
  return getAllDestinations().map((d) => d.id);
}

export function getCategoryByDestinationId(id: string): DestinationCategory | undefined {
  return destinationCategories.find((c) => c.destinations.some((d) => d.id === id));
}
