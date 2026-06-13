import { hotelGalleries } from "@/data/hotel-galleries";
import type { Hotel } from "@/types";

<<<<<<< HEAD
/** Gallery slides for a hotel — unique, hotel-property photos only */
=======
/** Gallery slides for a hotel, unique, hotel-property photos only */
>>>>>>> dhaval
export function getHotelGalleryImages(hotel: Hotel): string[] {
  const curated = hotelGalleries[hotel.id];
  if (curated?.length) {
    return [...curated];
  }
  return [hotel.image];
}
