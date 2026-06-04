import { hotels } from "@/data/hotels";
import type { Hotel } from "@/types";

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}
