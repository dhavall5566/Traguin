import { getDestinationPrimaryImage } from "@/data/destination-galleries";
import { images } from "@/lib/images";

const destImg = (id: string, fallback = "") => getDestinationPrimaryImage(id, fallback);

export type DestinationCategory = {
  id: string;
  title: string;
  description: string;
  destinations: {
    id: string;
    name: string;
    description: string;
    image: string;
    startingPrice: number;
  }[];
};

export const destinationCategories: DestinationCategory[] = [
  {
    id: "asia",
    title: "Asia",
    description: "Ancient cultures, modern luxury, and transformative hospitality.",
    destinations: [
      { id: "bali", name: "Bali", description: "Temples, terraces, and ocean sanctuaries.", image: destImg("bali", images.bali), startingPrice: 189000 },
      { id: "thailand", name: "Thailand", description: "Golden temples and island serenity.", image: destImg("thailand", images.thailand), startingPrice: 156000 },
      { id: "vietnam", name: "Vietnam", description: "Heritage trails and coastal charm.", image: destImg("vietnam", images.vietnam), startingPrice: 178000 },
      { id: "singapore", name: "Singapore", description: "Urban sophistication in the tropics.", image: destImg("singapore", images.singapore), startingPrice: 198000 },
      { id: "japan", name: "Japan", description: "Precision, beauty, and culinary artistry.", image: destImg("japan"), startingPrice: 385000 },
    ],
  },
  {
    id: "europe",
    title: "Europe",
    description: "Timeless cities, alpine retreats, and cultural grandeur.",
    destinations: [
      { id: "switzerland", name: "Switzerland", description: "Alpine peaks and European refinement.", image: destImg("switzerland", images.switzerland), startingPrice: 425000 },
    ],
  },
  {
    id: "middle-east",
    title: "Middle East",
    description: "Desert luxury and architectural wonder.",
    destinations: [
      { id: "dubai", name: "Dubai", description: "Skyline splendor and desert adventures.", image: destImg("dubai", images.dubai), startingPrice: 245000 },
    ],
  },
  {
    id: "indian-escapes",
    title: "Indian Escapes",
    description: "Diverse landscapes woven into singular luxury journeys.",
    destinations: [
      { id: "kashmir", name: "Kashmir", description: "Dal Lake and mountain serenity.", image: destImg("kashmir", images.kashmir), startingPrice: 78000 },
      { id: "kerala", name: "Kerala", description: "Backwaters and Ayurvedic wellness.", image: destImg("kerala", images.kerala), startingPrice: 89000 },
      { id: "goa", name: "Goa", description: "Coastal elegance and heritage.", image: destImg("goa", images.goa), startingPrice: 65000 },
      { id: "ladakh", name: "Ladakh", description: "High-altitude adventure and monasteries.", image: destImg("ladakh", images.ladakh), startingPrice: 95000 },
    ],
  },
  {
    id: "island-retreats",
    title: "Island Retreats",
    description: "Private shores and overwater sanctuaries.",
    destinations: [
      { id: "maldives", name: "Maldives", description: "Overwater villas and turquoise calm.", image: destImg("maldives"), startingPrice: 295000 },
      { id: "bali", name: "Bali", description: "Island soul and luxury villas.", image: destImg("bali", images.bali), startingPrice: 189000 },
    ],
  },
  {
    id: "luxury-cruises",
    title: "Luxury Cruises",
    description: "Voyages across oceans with white-glove service.",
    destinations: [
      { id: "mediterranean", name: "Mediterranean", description: "Coastal gems and cultural ports.", image: destImg("mediterranean"), startingPrice: 520000 },
      { id: "asia-pacific", name: "Asia Pacific", description: "Exotic shores and island chains.", image: destImg("asia-pacific"), startingPrice: 480000 },
    ],
  },
];
