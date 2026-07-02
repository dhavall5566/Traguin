export type PlanMyJourneySearchParams = {
  itinerary_id?: string;
  itinerary_slug?: string;
  itinerary_title?: string;
  destination?: string;
};

export function buildPlanMyJourneyHref(params?: PlanMyJourneySearchParams): string {
  if (!params) return "/plan-my-journey";
  const qs = new URLSearchParams();
  if (params.itinerary_id) qs.set("itinerary_id", params.itinerary_id);
  if (params.itinerary_slug) qs.set("itinerary_slug", params.itinerary_slug);
  if (params.itinerary_title) qs.set("itinerary_title", params.itinerary_title);
  if (params.destination) qs.set("destination", params.destination);
  const query = qs.toString();
  return query ? `/plan-my-journey?${query}` : "/plan-my-journey";
}

export function parsePlanMyJourneySearchParams(
  searchParams: Record<string, string | string[] | undefined>
): PlanMyJourneySearchParams {
  const pick = (key: keyof PlanMyJourneySearchParams) => {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value?.trim() || undefined;
  };
  return {
    itinerary_id: pick("itinerary_id"),
    itinerary_slug: pick("itinerary_slug"),
    itinerary_title: pick("itinerary_title"),
    destination: pick("destination"),
  };
}
