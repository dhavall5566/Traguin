import { buildHotelsByUuidMap, mapCmsHotelsToHotels } from "./hotels";
import { buildMediaUrlMap, getDestinations, getFaqs, getHotels, getMediaAssets, getPackages } from "./cms";
import type { CmsDestination, CmsFaq, CmsPackage } from "./types";
import type { Hotel } from "@/types";

export type CmsDetailContext = {
  mediaMap: Map<string, string>;
  faqs: CmsFaq[];
  cmsDestinations: CmsDestination[];
  packagesById: Map<string, CmsPackage>;
  hotelsCatalog: Hotel[];
  hotelsByUuid: Map<string, Hotel>;
};

export async function loadCmsDetailContext(): Promise<CmsDetailContext> {
  const [mediaAssets, faqs, cmsHotels, cmsDestinations, cmsPackages] = await Promise.all([
    getMediaAssets(),
    getFaqs("itinerary"),
    getHotels(),
    getDestinations(),
    getPackages(),
  ]);
  const mediaMap = buildMediaUrlMap(mediaAssets);
  return {
    mediaMap,
    faqs,
    cmsDestinations,
    packagesById: new Map(cmsPackages.map((pkg) => [pkg.id, pkg])),
    hotelsCatalog: mapCmsHotelsToHotels(cmsHotels, cmsDestinations, mediaMap),
    hotelsByUuid: buildHotelsByUuidMap(cmsHotels, cmsDestinations, mediaMap),
  };
}
