import type { TravelMood } from "@/types";

const CANONICAL_MOODS = new Set<TravelMood>([
  "luxury",
  "adventure",
  "romantic",
  "family",
  "solo",
  "cultural",
  "wildlife",
  "beach",
  "nature",
  "spiritual",
]);

const MOOD_ALIASES: Record<string, TravelMood> = {
  family: "family",
  luxury: "luxury",
  romantic: "romantic",
  honeymoon: "romantic",
  nature: "nature",
  adventure: "adventure",
  beach: "beach",
  wildlife: "wildlife",
  wellness: "spiritual",
  spiritual: "spiritual",
  culture: "cultural",
  cultural: "cultural",
  pilgrimage: "spiritual",
  heritage: "cultural",
  corporate: "luxury",
  mice: "luxury",
  solo: "solo",
};

export function normalizeTravelMoods(moods: string[] | null | undefined): TravelMood[] {
  if (!moods?.length) return [];
  const seen = new Set<TravelMood>();
  const result: TravelMood[] = [];

  for (const raw of moods) {
    const key = raw.trim().toLowerCase();
    const mood =
      (CANONICAL_MOODS.has(key as TravelMood) ? (key as TravelMood) : MOOD_ALIASES[key]) ??
      null;
    if (mood && !seen.has(mood)) {
      seen.add(mood);
      result.push(mood);
    }
  }

  return result;
}
