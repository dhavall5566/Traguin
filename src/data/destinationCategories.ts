import { images } from "@/lib/images";

const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

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
      { id: "bali", name: "Bali", description: "Temples, terraces, and ocean sanctuaries.", image: images.bali, startingPrice: 189000 },
      { id: "thailand", name: "Thailand", description: "Golden temples and island serenity.", image: images.thailand, startingPrice: 156000 },
      { id: "vietnam", name: "Vietnam", description: "Heritage trails and coastal charm.", image: images.vietnam, startingPrice: 178000 },
      { id: "singapore", name: "Singapore", description: "Urban sophistication in the tropics.", image: images.singapore, startingPrice: 198000 },
      { id: "japan", name: "Japan", description: "Precision, beauty, and culinary artistry.", image: pexels(4020284, 1200), startingPrice: 385000 },
    ],
  },
  {
    id: "europe",
    title: "Europe",
    description: "Timeless cities, alpine retreats, and cultural grandeur.",
    destinations: [
      { id: "switzerland", name: "Switzerland", description: "Alpine peaks and European refinement.", image: images.switzerland, startingPrice: 425000 },
    ],
  },
  {
    id: "middle-east",
    title: "Middle East",
    description: "Desert luxury and architectural wonder.",
    destinations: [
      { id: "dubai", name: "Dubai", description: "Skyline splendor and desert adventures.", image: images.dubai, startingPrice: 245000 },
    ],
  },
  {
    id: "indian-escapes",
    title: "Indian Escapes",
    description: "Diverse landscapes woven into singular luxury journeys.",
    destinations: [
      { id: "kashmir", name: "Kashmir", description: "Dal Lake and mountain serenity.", image: images.kashmir, startingPrice: 78000 },
      { id: "kerala", name: "Kerala", description: "Backwaters and Ayurvedic wellness.", image: images.kerala, startingPrice: 89000 },
      { id: "goa", name: "Goa", description: "Coastal elegance and heritage.", image: images.goa, startingPrice: 65000 },
      { id: "ladakh", name: "Ladakh", description: "High-altitude adventure and monasteries.", image: images.ladakh, startingPrice: 95000 },
    ],
  },
  {
    id: "island-retreats",
    title: "Island Retreats",
    description: "Private shores and overwater sanctuaries.",
    destinations: [
      { id: "maldives", name: "Maldives", description: "Overwater villas and turquoise calm.", image: pexels(1287461, 1200), startingPrice: 295000 },
      { id: "bali", name: "Bali", description: "Island soul and luxury villas.", image: images.bali, startingPrice: 189000 },
    ],
  },
  {
    id: "luxury-cruises",
    title: "Luxury Cruises",
    description: "Voyages across oceans with white-glove service.",
    destinations: [
      { id: "mediterranean", name: "Mediterranean", description: "Coastal gems and cultural ports.", image: pexels(3601425, 1200), startingPrice: 520000 },
      { id: "asia-pacific", name: "Asia Pacific", description: "Exotic shores and island chains.", image: pexels(3608263, 1200), startingPrice: 480000 },
    ],
  },
];
