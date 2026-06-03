import { images } from "@/lib/images";

const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

/** Homepage featured cards — detail pages at /destinations/[id] */
export const featuredDestinations = [
  {
    id: "switzerland",
    name: "Switzerland",
    description: "Alpine elegance, private chalets, and refined European sophistication.",
    image: images.switzerland,
    startingPrice: 425000,
  },
  {
    id: "japan",
    name: "Japan",
    description: "Ancient temples, Michelin dining, and impeccable hospitality redefined.",
    image: pexels(4020284, 1920),
    startingPrice: 385000,
  },
  {
    id: "maldives",
    name: "Maldives",
    description: "Overwater sanctuaries, turquoise lagoons, and absolute seclusion.",
    image: pexels(1287461, 1920),
    startingPrice: 295000,
  },
  {
    id: "dubai",
    name: "Dubai",
    description: "Desert opulence, architectural marvels, and world-class luxury.",
    image: images.dubai,
    startingPrice: 245000,
  },
  {
    id: "bali",
    name: "Bali",
    description: "Soulful island escapes where culture, wellness, and ocean meet.",
    image: images.bali,
    startingPrice: 189000,
  },
  {
    id: "kashmir",
    name: "Kashmir",
    description: "Snow-capped peaks, Dal Lake houseboats, and timeless Indian romance.",
    image: images.kashmir,
    startingPrice: 78000,
  },
] as const;
