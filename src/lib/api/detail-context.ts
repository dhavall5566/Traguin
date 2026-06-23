import { buildHotelsByUuidMap, mapCmsHotelsToHotels } from "./hotels";
import { buildMediaUrlMap, getDestinations, getFaqs, getHotels, getMediaAssets } from "./cms";
import type { CmsDestination, CmsFaq } from "./types";
import type { Hotel } from "@/types";

export type CmsDetailContext = {
  mediaMap: Map<string, string>;
  faqs: CmsFaq[];
  cmsDestinations: CmsDestination[];
  hotelsCatalog: Hotel[];
  hotelsByUuid: Map<string, Hotel>;
};

export async function loadCmsDetailContext(): Promise<CmsDetailContext> {
  const [mediaAssets, faqs, cmsHotels, cmsDestinations] = await Promise.all([
    getMediaAssets(),
    getFaqs("itinerary"),
    getHotels(),
    getDestinations(),
  ]);
  const mediaMap = buildMediaUrlMap(mediaAssets);
  return {
    mediaMap,
    faqs,
    cmsDestinations,
    hotelsCatalog: mapCmsHotelsToHotels(cmsHotels, cmsDestinations, mediaMap),
    hotelsByUuid: buildHotelsByUuidMap(cmsHotels, cmsDestinations, mediaMap),
  };
}
