import { galleryImages } from "@/lib/gallery-images";

export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "luxury", label: "Luxury" },
  { id: "resort", label: "Resort" },
  { id: "adventure", label: "Adventure" },
  { id: "aerial", label: "Aerial" },
  { id: "tropical", label: "Tropical" },
  { id: "elite", label: "Elite" },
  { id: "nature", label: "Nature" },
  { id: "cruise", label: "Cruise" },
] as const;

export type GalleryCategoryId = (typeof galleryCategories)[number]["id"];
export type GalleryTag = Exclude<GalleryCategoryId, "all">;

export type GalleryLabelStyle = "watermark" | "stamp" | "ribbon" | "stack";
export type GalleryLayout = "hero" | "wide" | "tall" | "card";

export type GalleryItem = {
  id: string;
  place: string;
  region: string;
  image: string;
  alt: string;
  tags: GalleryTag[];
  layout: GalleryLayout;
  labelStyle: GalleryLabelStyle;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "santorini",
    place: "Santorini",
    region: "Greece",
    image: galleryImages.santorini,
    alt: "Whitewashed villages and caldera views in Santorini",
    tags: ["luxury", "resort", "aerial"],
    layout: "hero",
    labelStyle: "watermark",
  },
  {
    id: "maldives",
    place: "Maldives",
    region: "Indian Ocean",
    image: galleryImages.maldives,
    alt: "Overwater villas above turquoise Maldivian lagoons",
    tags: ["tropical", "resort", "elite", "cruise"],
    layout: "tall",
    labelStyle: "ribbon",
  },
  {
    id: "amalfi",
    place: "Amalfi",
    region: "Italy",
    image: galleryImages.amalfi,
    alt: "Clifftop villages along the Amalfi Coast",
    tags: ["luxury", "resort", "aerial"],
    layout: "card",
    labelStyle: "stack",
  },
  {
    id: "kyoto",
    place: "Kyoto",
    region: "Japan",
    image: galleryImages.kyoto,
    alt: "Temple gardens and lantern-lit streets in Kyoto",
    tags: ["elite", "nature", "luxury"],
    layout: "card",
    labelStyle: "stamp",
  },
  {
    id: "patagonia",
    place: "Patagonia",
    region: "Argentina",
    image: galleryImages.patagonia,
    alt: "Granite peaks and glacial lakes in Patagonia",
    tags: ["adventure", "nature", "aerial"],
    layout: "wide",
    labelStyle: "watermark",
  },
  {
    id: "iceland",
    place: "Iceland",
    region: "Nordic",
    image: galleryImages.iceland,
    alt: "Waterfall cascading through moss-covered Icelandic cliffs",
    tags: ["adventure", "nature", "aerial"],
    layout: "card",
    labelStyle: "stack",
  },
  {
    id: "marrakech",
    place: "Marrakech",
    region: "Morocco",
    image: galleryImages.marrakech,
    alt: "Ornate riad courtyards and spice markets in Marrakech",
    tags: ["luxury", "elite", "adventure"],
    layout: "card",
    labelStyle: "ribbon",
  },
  {
    id: "queenstown",
    place: "Queenstown",
    region: "New Zealand",
    image: galleryImages.queenstown,
    alt: "Alpine lake framed by the Remarkables range",
    tags: ["adventure", "nature", "aerial"],
    layout: "tall",
    labelStyle: "stamp",
  },
  {
    id: "serengeti",
    place: "Serengeti",
    region: "Tanzania",
    image: galleryImages.serengeti,
    alt: "Golden savanna horizon at dusk in the Serengeti",
    tags: ["nature", "adventure", "elite"],
    layout: "wide",
    labelStyle: "stack",
  },
  {
    id: "norway-fjord",
    place: "Geiranger",
    region: "Norway",
    image: galleryImages.norwayFjord,
    alt: "Deep fjord walls rising from still Nordic water",
    tags: ["cruise", "nature", "aerial"],
    layout: "card",
    labelStyle: "watermark",
  },
  {
    id: "riviera",
    place: "Riviera",
    region: "France",
    image: galleryImages.riviera,
    alt: "Azure Mediterranean coves along the French Riviera",
    tags: ["luxury", "resort", "cruise", "tropical"],
    layout: "card",
    labelStyle: "ribbon",
  },
  {
    id: "banff",
    place: "Banff",
    region: "Canada",
    image: galleryImages.banff,
    alt: "Alpine valley and snow-capped peaks in the Canadian Rockies",
    tags: ["nature", "adventure", "aerial"],
    layout: "card",
    labelStyle: "stamp",
  },
  {
    id: "mykonos",
    place: "Mykonos",
    region: "Greece",
    image: galleryImages.mykonos,
    alt: "Windmills and whitewashed lanes above the Aegean",
    tags: ["luxury", "resort", "tropical"],
    layout: "card",
    labelStyle: "stack",
  },
  {
    id: "tuscany",
    place: "Tuscany",
    region: "Italy",
    image: galleryImages.tuscany,
    alt: "Rolling vineyards and cypress lines in Tuscany",
    tags: ["luxury", "nature", "resort"],
    layout: "wide",
    labelStyle: "watermark",
  },
  {
    id: "azores",
    place: "Azores",
    region: "Portugal",
    image: galleryImages.azores,
    alt: "Crater lake surrounded by cloud forest in the Azores",
    tags: ["nature", "adventure", "aerial"],
    layout: "card",
    labelStyle: "ribbon",
  },
  {
    id: "seychelles",
    place: "Seychelles",
    region: "Indian Ocean",
    image: galleryImages.seychelles,
    alt: "Granite boulders and powder sand in the Seychelles",
    tags: ["tropical", "resort", "elite"],
    layout: "card",
    labelStyle: "stamp",
  },
  {
    id: "petra",
    place: "Petra",
    region: "Jordan",
    image: galleryImages.petra,
    alt: "Rose-red treasury façade carved into Petra's sandstone",
    tags: ["adventure", "elite", "nature"],
    layout: "card",
    labelStyle: "stack",
  },
  {
    id: "cinque-terre",
    place: "Cinque Terre",
    region: "Italy",
    image: galleryImages.cinqueTerre,
    alt: "Colourful cliffside villages of Cinque Terre at sunset",
    tags: ["luxury", "resort", "aerial", "cruise"],
    layout: "hero",
    labelStyle: "ribbon",
  },
];

export function filterGalleryItems(
  items: GalleryItem[],
  category: GalleryCategoryId
): GalleryItem[] {
  if (category === "all") return items;
  return items.filter((item) => item.tags.includes(category));
}
