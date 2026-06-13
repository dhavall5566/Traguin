import { getDestinationPrimaryImage } from "@/data/destination-galleries";
import { images } from "@/lib/images";

/** Homepage featured cards, detail pages at /destinations/[id] */
export const featuredDestinations = [
  {
    id: "switzerland",
    name: "Switzerland",
    description: "Alpine elegance, private chalets, and refined European sophistication.",
    image: getDestinationPrimaryImage("switzerland", images.switzerland),
    startingPrice: 425000,
  },
  {
    id: "japan",
    name: "Japan",
    description: "Ancient temples, Michelin dining, and impeccable hospitality redefined.",
    image: getDestinationPrimaryImage("japan"),
    startingPrice: 385000,
  },
  {
    id: "maldives",
    name: "Maldives",
    description: "Overwater sanctuaries, turquoise lagoons, and absolute seclusion.",
    image: getDestinationPrimaryImage("maldives"),
    startingPrice: 295000,
  },
  {
    id: "dubai",
    name: "Dubai",
    description: "Desert opulence, architectural marvels, and world-class luxury.",
    image: getDestinationPrimaryImage("dubai", images.dubai),
    startingPrice: 245000,
  },
  {
    id: "bali",
    name: "Bali",
    description: "Soulful island escapes where culture, wellness, and ocean meet.",
    image: getDestinationPrimaryImage("bali", images.bali),
    startingPrice: 189000,
  },
  {
    id: "kashmir",
    name: "Kashmir",
    description: "Snow-capped peaks, Dal Lake houseboats, and timeless Indian romance.",
    image: getDestinationPrimaryImage("kashmir", images.kashmir),
    startingPrice: 78000,
  },
] as const;
