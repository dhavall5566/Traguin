import { hotelGalleries } from "@/data/hotel-galleries";
import type { Hotel } from "@/types";

/** Gallery slides for a hotel, unique, hotel-property photos only */
export function getHotelGalleryImages(hotel: Hotel): string[] {
  if (hotel.gallery?.length) {
    return [...hotel.gallery];
  }
  const curated = hotelGalleries[hotel.id];
  if (curated?.length) {
    return [...curated];
  }
  return [hotel.image];
}
