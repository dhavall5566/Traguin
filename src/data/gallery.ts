import { images } from "@/lib/images";
import { galleryImages } from "@/lib/gallery-images";
import { packages } from "@/data/packages";
import { testimonials } from "@/data/moods";

export const galleryClientWall = testimonials.map((client, index) => ({
  id: client.id,
  name: client.name,
  destination: client.destination,
  image: client.image,
  rotate: [-3, 2, -1, 3, -2, 1][index % 6],
}));

export const galleryMoments = [
  {
    id: "kashmir-shikara",
    type: "photo",
    title: "Dal Lake Quiet Morning",
    destination: "Kashmir",
    caption: "Client shikara transfer arranged before sunrise.",
    image: packages.find((pkg) => pkg.destination === "Kashmir")?.image ?? images.kashmir,
    featured: true,
  },
  {
    id: "bali-villa-film",
    type: "video",
    title: "Bali Villa Arrival",
    destination: "Bali",
    caption: "A short travel film from a private honeymoon arrival.",
    poster: packages.find((pkg) => pkg.destination === "Bali")?.image ?? images.bali,
    src: "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4",
    featured: true,
  },
  {
    id: "swiss-alpine",
    type: "photo",
    title: "Alpine First Class",
    destination: "Switzerland",
    caption: "Glacier-route views paired with a private dining plan.",
    image: packages.find((pkg) => pkg.destination === "Switzerland")?.image ?? images.switzerland,
    featured: false,
  },
  {
    id: "kerala-backwaters",
    type: "photo",
    title: "Backwater Stillness",
    destination: "Kerala",
    caption: "Family houseboat day with a slow, unhurried pace.",
    image: packages.find((pkg) => pkg.destination === "Kerala")?.image ?? images.kerala,
    featured: false,
  },
  {
    id: "desert-table",
    type: "video",
    title: "Private Desert Table",
    destination: "Dubai",
    caption: "Golden-hour dining setup after a private desert drive.",
    poster: packages.find((pkg) => pkg.destination === "Dubai")?.image ?? images.dubai,
    src: "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4",
    featured: false,
  },
  {
    id: "japan-ritual",
    type: "photo",
    title: "Cultural Discovery",
    destination: "Japan",
    caption: "Quiet temple access and guided rituals away from crowds.",
    image: packages.find((pkg) => pkg.destination === "Japan")?.image ?? images.hero,
    featured: false,
  },
] as const;

export type GalleryMoment = (typeof galleryMoments)[number];

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
