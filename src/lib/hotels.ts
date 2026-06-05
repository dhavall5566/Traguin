import { hotels } from "@/data/hotels";
import type { ItineraryHotel } from "@/types/itinerary";
import type { Hotel } from "@/types";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Itinerary hotel names → luxury stays catalog ids */
const NAME_TO_ID: Record<string, string> = {
  "amandari ubud": "amandari-ubud",
  "bulgari resort bali": "bulgari-bali",
  "mont cervin palace": "mont-cervin-palace",
  "brunton boatyard": "brunton-boatyard",
  "luxury houseboat": "luxury-houseboat",
  "heritage houseboat": "heritage-houseboat",
  "burj al arab jumeirah": "burj-al-arab",
  "mandarin oriental bangkok": "mandarin-oriental-bangkok",
  "beachfront luxury resort": "beachfront-luxury-resort",
  "ahilya by the sea": "ahilya-by-the-sea",
  "the grand dragon ladakh": "the-grand-dragon",
  "pangong lake luxury camp": "pangong-lake-camp",
  "sofitel legend metropole hanoi": "sofitel-metropole-hanoi",
  "anantara hoi an resort": "anantara-hoi-an",
  "marina bay sands": "marina-bay-sands",
  "badrutts palace": "badrutt-palace",
};

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

export function findHotelForItineraryHotel(itineraryHotel: ItineraryHotel): Hotel | undefined {
  const key = normalize(itineraryHotel.name);
  const aliasId = NAME_TO_ID[key];
  if (aliasId) return getHotelById(aliasId);

  return hotels.find((hotel) => {
    const hotelKey = normalize(hotel.name);
    return hotelKey === key || hotelKey.includes(key) || key.includes(hotelKey);
  });
}

/** Deep link to luxury stays — opens property detail when matched */
export function getLuxuryStayHrefForItineraryHotel(itineraryHotel: ItineraryHotel): string {
  const match = findHotelForItineraryHotel(itineraryHotel);
  if (match) {
    return `/luxury-stays?hotel=${encodeURIComponent(match.id)}`;
  }

  const destination =
    itineraryHotel.location.split(",").pop()?.trim() ||
    itineraryHotel.location.split("·")[0]?.trim() ||
    itineraryHotel.location;

  return `/luxury-stays?destination=${encodeURIComponent(destination)}`;
}
