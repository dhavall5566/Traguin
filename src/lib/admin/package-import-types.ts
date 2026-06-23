export type ExtractedDestinationDraft = {
  name: string;
  slug?: string | null;
  country?: string | null;
  region: "domestic" | "international";
  india_region?: "north" | "east" | "south" | "west" | null;
  description: string;
  starting_price?: number | null;
  moods: string[];
  is_domestic?: boolean | null;
};

export type ExtractedPackageDraft = {
  title: string;
  slug?: string | null;
  tagline?: string | null;
  duration_label: string;
  duration_days?: number | null;
  starting_price?: number | null;
  price_on_request: boolean;
  highlights: string[];
  moods: string[];
};

export type ExtractedItineraryDayDraft = {
  day_number: number;
  title: string;
  description: string;
  activities: string[];
  sort_order: number;
};

export type ExtractedItineraryHotelDraft = {
  name: string;
  location: string;
  nights_label: string;
  description?: string | null;
  category_label?: string | null;
  sort_order: number;
};

export type ExtractedItineraryInclusionDraft = {
  kind: "included" | "excluded";
  text: string;
  sort_order: number;
};

export type ExtractedItineraryHighlightDraft = {
  text: string;
  sort_order: number;
};

export type ExtractedItineraryDraft = {
  title: string;
  slug?: string | null;
  tagline: string;
  overview: string;
  duration_label: string;
  duration_days: number;
  starting_price?: number | null;
  price_on_request: boolean;
  price_note?: string | null;
  days: ExtractedItineraryDayDraft[];
  hotels: ExtractedItineraryHotelDraft[];
  inclusions: ExtractedItineraryInclusionDraft[];
  highlights: ExtractedItineraryHighlightDraft[];
};

export type ExtractedPackageBundle = {
  destination: ExtractedDestinationDraft;
  package: ExtractedPackageDraft;
  itinerary: ExtractedItineraryDraft;
  places_mentioned: string[];
};

export type SourcedPlaceImage = {
  place: string;
  search_query: string;
  url?: string | null;
  preview_url?: string | null;
  photographer?: string | null;
  width?: number | null;
  height?: number | null;
  media_asset_id?: string | null;
  error?: string | null;
};

export type PackageImportExtractResponse = {
  filename: string;
  raw_text: string;
  raw_text_char_count: number;
  extracted: ExtractedPackageBundle;
  llm_raw_json: Record<string, unknown>;
  images: SourcedPlaceImage[];
  warnings: string[];
};

export type PackageImportReviewCommit = {
  destination: ExtractedDestinationDraft;
  package: ExtractedPackageDraft;
  itinerary: ExtractedItineraryDraft;
  category_ids?: string[];
  hero_media_id?: string | null;
  package_hero_media_id?: string | null;
  itinerary_hero_media_id?: string | null;
  gallery_media_ids?: string[];
};
