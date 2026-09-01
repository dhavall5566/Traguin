/**
 * Destination-accurate photos. India region cards use one unique Unsplash
 * image each so listing cards never share stock or auto-slide multiple frames.
 * Matterhorn (417173) is reserved for Switzerland only.
 */
import type { IndiaRegion } from "@/lib/destination-listing-types";
import { FALLBACK_IMAGE, images } from "@/lib/images";

const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80`;

/** CMS slug aliases → curated gallery key */
const SLUG_ALIASES: Record<string, string> = {
  "jammu-kashmir": "kashmir",
};

const INDIA_REGION_HERO: Record<IndiaRegion, string> = {
  north: u("1722915767859-08a59870d70b"),
  central: u("1672215051880-7594629a2ffb"),
  south: images.kerala,
  west: images.rajasthan,
  east: u("1561289023-56c2e530bc8a"),
};

/** Prefer curated hero over CMS for these slugs so region cards stay unique. */
const CURATED_HERO_FIRST = new Set([
  "kashmir",
  "himachal",
  "haryana",
  "ladakh",
  "uttarakhand",
  "punjab",
  "delhi",
  "uttar-pradesh",
  "chhattisgarh",
  "jharkhand",
  "madhya-pradesh",
  "maharashtra",
  "rajasthan",
  "dadra-and-nagar-haveli",
  "daman-and-diu",
  "andaman-and-nicobar",
  "kerala",
  "lakshadweep",
  "tamil-nadu",
  "andhra-pradesh",
  "karnataka",
  "puducherry",
  "west-bengal",
  "odisha",
  "assam",
  "sikkim",
  "bihar",
  "arunachal-pradesh",
]);

export const destinationGalleries: Record<string, readonly string[]> = {
  switzerland: [
    p(417173),
    p(6720718),
    p(1365425),
    p(5728978),
    u("1506905925346-21bda4d32df4"),
  ],
  japan: [p(30988649), p(402028), p(31604390), p(16412311), p(3408354)],
  maldives: [p(1285626), p(1032650), p(1174730), p(3251930), p(4578819)],
  dubai: [
    u("1512453979798-5ea266f8880c"),
    p(338504),
    p(189296),
    p(3768111),
    p(6642521),
  ],
  bali: [p(3608263), p(2581922), p(2166553), p(7061662), p(2766971)],
  thailand: [
    u("1552465011-b4e21bf6e79a"),
    p(1040880),
    p(2175682),
    p(1764207),
    p(3227646),
  ],
  vietnam: [p(3787839), p(4099234), p(3951377), p(2666816), p(5773808)],
  singapore: [p(259447), p(1823384), p(3385153), p(2132465), p(5824529)],
  kerala: [u("1593693401060-9fc28cf9e368")],
  goa: [p(248797), p(1017636), p(3228985), p(3808009), p(903376)],
  // North India — one unique Unsplash image each (no shared stock, no card sliders)
  kashmir: [u("1506466010722-395aa2bef877")],
  himachal: [u("1722915767859-08a59870d70b")],
  haryana: [u("1500382017468-9049fed747ef")],
  ladakh: [u("1605649487212-47bdab064df7")],
  uttarakhand: [u("1582510003544-4d00b7f74220")],
  punjab: [u("1623059508779-2542c6e83753")],
  delhi: [u("1587474260584-136574528ed5")],
  "uttar-pradesh": [u("1564507592333-c60657eea523")],
  // Central India — one unique Unsplash image each
  chhattisgarh: [u("1673462107499-97848ff888b9")],
  jharkhand: [u("1621578847110-61f6cf5a3d9e")],
  "madhya-pradesh": [u("1672215051880-7594629a2ffb")],
  // West India — one unique Unsplash image each
  maharashtra: [u("1570168007204-dfb528c6958f")],
  rajasthan: [u("1545126178-862cdb469409")],
  "dadra-and-nagar-haveli": [u("1441974231531-c6227db76b6e")],
  "daman-and-diu": [u("1694931537785-ca96d985b52c")],
  // South India — one unique Unsplash image each
  "andaman-and-nicobar": [u("1545762374-d18079617da8")],
  lakshadweep: [u("1572025310208-2fd6b91764c1")],
  "tamil-nadu": [u("1572146462570-2129a547e6dd")],
  "andhra-pradesh": [u("1609854534028-b512f5246abc")],
  karnataka: [u("1580294647332-8a399cd9ed45")],
  puducherry: [u("1569157087866-f4a8e9250605")],
  // East India — one unique Unsplash image each
  "west-bengal": [u("1561289023-56c2e530bc8a")],
  odisha: [u("1601815264039-67c8ba1a7f98")],
  assam: [u("1637391783805-f1393be00fcf")],
  sikkim: [u("1585914285309-4b1fe30b53ed")],
  bihar: [u("1663026334663-5026b4f43ac6")],
  "arunachal-pradesh": [u("1626761627604-f27d98885f4b")],
  australia: [u("1506973035872-a4ec16b8e8d9")],
  gujarat: [p(631317), p(1179229), p(2367253), p(752042), p(1121111)],
  mediterranean: [p(3601425), p(1018698), p(1486975), p(2835562), p(3153803)],
  "asia-pacific": [p(7653644), p(6480707), p(3581365), p(1252869), p(2373713)],
};

/** Primary thumbnail / hero, first curated frame for a destination */
export function getDestinationPrimaryImage(destinationId: string, fallback = ""): string {
  const slug = SLUG_ALIASES[destinationId] ?? destinationId;
  return destinationGalleries[slug]?.[0] ?? fallback;
}

export function resolveDestinationHeroImage(
  destinationSlug: string,
  options?: {
    cmsImage?: string;
    indiaRegion?: IndiaRegion;
    region?: "domestic" | "international";
  }
): string {
  const slug = SLUG_ALIASES[destinationSlug] ?? destinationSlug;
  const curated = destinationGalleries[slug]?.[0];

  // India region listing cards: always use the curated single image (avoids CMS duplicates).
  if (CURATED_HERO_FIRST.has(slug) && curated) {
    return curated;
  }

  const cmsImage = options?.cmsImage?.trim();
  if (cmsImage) return cmsImage;

  if (curated) return curated;

  const catalogImage = images[slug as keyof typeof images];
  if (typeof catalogImage === "string") return catalogImage;

  if (options?.region === "domestic" && options.indiaRegion) {
    return INDIA_REGION_HERO[options.indiaRegion];
  }

  return FALLBACK_IMAGE;
}
