/** Mirrors backend PaginatedResponse[T] */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface CmsTimestamped {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface CmsMediaAsset extends CmsTimestamped {
  slug: string | null;
  url: string;
  alt_text: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  source: string;
  usage: string | null;
  tags: string[] | null;
}

export interface CmsPackageHighlight extends CmsTimestamped {
  text: string;
  sort_order: number;
}

export interface CmsPackage extends CmsTimestamped {
  slug: string;
  destination_id: string;
  title: string;
  duration_label: string;
  price: number;
  hero_media_id: string | null;
  rating: string | number | null;
  is_featured: boolean;
  featured_sort_order: number | null;
  is_published: boolean;
  sold_last_month: number;
  highlights: CmsPackageHighlight[];
  moods: string[];
}

export interface CmsDestination extends CmsTimestamped {
  slug: string;
  name: string;
  country: string | null;
  region: "domestic" | "international";
  india_region: string | null;
  description: string;
  starting_price: number;
  hero_media_id: string | null;
  lat: string | number | null;
  lng: string | number | null;
  moods: string[];
  package_count: number | null;
  hotel_count: number | null;
  is_featured: boolean;
  featured_sort_order: number | null;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  categories: { id: string; slug: string; title: string; sort_order: number | null }[];
  gallery_media: { id: string; url: string; alt_text: string | null; sort_order: number | null }[];
}

export interface CmsItineraryHighlight extends CmsTimestamped {
  text: string;
  sort_order: number;
}

export interface CmsItineraryDay extends CmsTimestamped {
  day_number: number;
  title: string;
  description: string;
  activities: string[];
  sort_order: number;
}

export interface CmsItineraryHotel extends CmsTimestamped {
  hotel_id: string | null;
  name: string;
  location: string;
  nights_label: string;
  description: string | null;
  stars: number | null;
  category_label: string | null;
  room_type: string | null;
  meal_plan: string | null;
  image_media_id: string | null;
  sort_order: number;
}

export interface CmsItineraryInclusion extends CmsTimestamped {
  kind: "included" | "excluded";
  text: string;
  sort_order: number;
}

export interface CmsItinerary extends CmsTimestamped {
  slug: string;
  package_id: string | null;
  destination_id: string;
  title: string;
  duration_label: string;
  duration_days: number;
  starting_price: number;
  price_note: string | null;
  rating: string | number | null;
  review_count: number | null;
  hero_media_id: string | null;
  tagline: string;
  overview: string;
  is_featured: boolean;
  featured_sort_order: number | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  highlights: CmsItineraryHighlight[];
  days: CmsItineraryDay[];
  hotels: CmsItineraryHotel[];
  inclusions: CmsItineraryInclusion[];
  gallery_media: { id: string; url: string; alt_text: string | null; sort_order: number | null }[];
}

export interface CmsCompanyStats {
  id: number;
  homepage_stats: CmsStatJson[];
  trust_bar_stats: CmsStatJson[];
  gallery_stats: CmsStatJson[];
  created_at: string;
  updated_at: string;
}

/** Flexible JSONB stat objects from CMS */
export type CmsStatJson = {
  id?: string;
  label?: string;
  value?: number | string;
  suffix?: string;
  decimals?: number;
  hero_slider_max_items?: number;
  visible_package_ids?: string[];
};

export interface CmsHomepageRegionPanel extends CmsTimestamped {
  key: string;
  label: string;
  title: string;
  description: string;
  highlights: string[];
  stat_text: string;
  href: string;
  mood: string | null;
  hero_media_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CmsHomepagePromo {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  assurances: CmsAssuranceJson[];
  created_at: string;
  updated_at: string;
}

export type CmsAssuranceJson = {
  icon_key?: string;
  title?: string;
  label?: string;
};

export interface CmsExperienceOffer extends CmsTimestamped {
  icon_key: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface CmsExperienceStat extends CmsTimestamped {
  value: string;
  label: string;
  sort_order: number;
}

export interface CmsExperienceProcessStep extends CmsTimestamped {
  step_label: string;
  title: string;
  detail: string;
  sort_order: number;
}

export interface CmsExperience extends CmsTimestamped {
  slug: string;
  eyebrow: string;
  headline: string;
  intro: string;
  hero_media_id: string | null;
  card_number: string | null;
  card_title: string | null;
  card_description: string | null;
  image_caption: string | null;
  layout: string | null;
  variant: string | null;
  quote: string | null;
  cta_title: string | null;
  cta_description: string | null;
  show_on_homepage: boolean;
  homepage_sort_order: number | null;
  is_published: boolean;
  offers: CmsExperienceOffer[];
  stats: CmsExperienceStat[];
  process_steps: CmsExperienceProcessStep[];
}

export interface CmsJourneyProcessStep extends CmsTimestamped {
  step_label: string;
  title: string;
  description: string;
  detail: string;
  icon_key: string;
  sort_order: number;
}

export interface CmsSpecialization extends CmsTimestamped {
  slug: string;
  title: string;
  description: string;
  icon_key: string;
  sort_order: number;
}

export interface CmsConciergeService extends CmsTimestamped {
  slug: string;
  number_label: string;
  title: string;
  description: string;
  icon_key: string;
  image_media_id: string | null;
  is_featured: boolean;
  is_wide: boolean;
  sort_order: number;
}

export interface CmsTravelExpertSettings {
  id: number;
  desk_headline: string;
  hours_label: string;
  hours_value: string;
  live_desk_label: string;
  live_desk_value: string;
  created_at: string;
  updated_at: string;
}

export interface CmsValueProposition extends CmsTimestamped {
  step_label: string;
  title: string;
  description: string;
  highlight: string;
  icon_key: string;
  sort_order: number;
}

export interface CmsFaq extends CmsTimestamped {
  itinerary_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
}

export interface CmsHotelNearbyAttraction extends CmsTimestamped {
  name: string;
  distance_label: string;
  sort_order: number;
}

export interface CmsHotel extends CmsTimestamped {
  slug: string;
  destination_id: string;
  name: string;
  stars: number;
  price: number;
  rating: string | number | null;
  review_count: number | null;
  description: string | null;
  hero_media_id: string | null;
  amenities: string[];
  is_published: boolean;
  nearby_attractions: CmsHotelNearbyAttraction[];
  gallery_media: { id: string; url: string; alt_text: string | null; sort_order: number | null }[];
}

export interface CmsRedirect extends CmsTimestamped {
  old_path: string;
  target_type: string;
  target_id: string | null;
  target_path: string | null;
  is_permanent: boolean;
}

export interface CmsClientStory extends CmsTimestamped {
  client_name: string;
  destination_id: string | null;
  destination_name: string | null;
  quote: string | null;
  portrait_media_id: string | null;
  show_on_home: boolean;
  show_in_gallery: boolean;
  is_featured_in_gallery: boolean;
  home_sort_order: number | null;
  gallery_sort_order: number | null;
  is_published: boolean;
}

export interface CmsGalleryCategory extends CmsTimestamped {
  slug: string;
  label: string;
  sort_order: number;
}

export interface CmsGalleryCategorySummary {
  id: string;
  slug: string;
  label: string;
}

export interface CmsGalleryItem extends CmsTimestamped {
  slug: string;
  place: string;
  region_label: string;
  media_id: string | null;
  media: { id: string; url: string; alt_text: string | null; sort_order: number | null }[];
  layout: string;
  label_style: string;
  sort_order: number | null;
  is_published: boolean;
  categories: CmsGalleryCategorySummary[];
}

export interface CmsAboutPageHeader {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CmsAboutStorySection extends CmsTimestamped {
  title: string;
  body: string;
  sort_order: number;
}

export interface CmsJobOpening extends CmsTimestamped {
  slug: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  sort_order: number;
  is_published: boolean;
}

export interface CmsCareersPageExtras {
  id: number;
  culture_chips: string[];
  fallback_title: string;
  fallback_description: string;
  created_at: string;
  updated_at: string;
}

/** JSONB items are untyped on the API — mapper normalizes to frontend shape. */
export interface CmsLegalPage extends CmsTimestamped {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  effective_date: string;
  hero_media_id: string | null;
  hero_image_alt: string | null;
  sections: unknown[];
  meta_title: string | null;
}

export interface CmsHomepageBundle {
  packages: CmsPackage[];
  destinations: CmsDestination[];
  itineraries: CmsItinerary[];
  media: CmsMediaAsset[];
  company_stats: CmsCompanyStats;
  region_panels: CmsHomepageRegionPanel[];
  homepage_promo: CmsHomepagePromo | null;
  experiences: CmsExperience[];
  journey_process_steps: CmsJourneyProcessStep[];
  specializations: CmsSpecialization[];
  value_propositions: CmsValueProposition[];
  client_stories: CmsClientStory[];
}
