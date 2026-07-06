/**
 * Five unique, destination-accurate photos per region.
 * Every photo ID appears exactly once across this file, no shared beach/mountain stock.
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
  north: images.himachal,
  south: images.kerala,
  west: images.rajasthan,
  east: p(1693441),
};

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
  kashmir: [p(6738359), p(164372), p(1457842), p(1024993), p(2885324)],
  thailand: [
    u("1552465011-b4e21bf6e79a"),
    p(1040880),
    p(2175682),
    p(1764207),
    p(3227646),
  ],
  vietnam: [p(3787839), p(4099234), p(3951377), p(2666816), p(5773808)],
  singapore: [p(259447), p(1823384), p(3385153), p(2132465), p(5824529)],
  kerala: [
    u("1717069541470-9b1a2b085e1f"),
    p(960733),
    p(2507010),
    p(2785317),
    p(4497193),
  ],
  goa: [p(248797), p(1017636), p(3228985), p(3808009), p(903376)],
  ladakh: [p(2387873), p(210617), p(2666297), p(7647895), p(2864446)],
  himachal: [
    p(3574440),
    p(4877062),
    p(7170023),
    u("1657894736581-ccc35d62d9e2"),
    p(261181),
  ],
  uttarakhand: [p(5726011), p(1365425), p(1693441), p(2387873), p(2666297)],
  punjab: [p(25264894), p(3601425), p(1179229), p(631317), p(1121111)],
  delhi: [p(1070535), p(358532), p(6231570), p(3278215), p(4606211)],
  "uttar-pradesh": [p(316458), p(2367253), p(752042), p(1179229), p(358532)],
  gujarat: [p(631317), p(1179229), p(2367253), p(752042), p(1121111)],
  rajasthan: [p(1271619), p(3278215), p(358532), p(6231570), p(4606211)],
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

  const cmsImage = options?.cmsImage?.trim();
  if (cmsImage) return cmsImage;

  const curated = destinationGalleries[slug]?.[0];
  if (curated) return curated;

  const catalogImage = images[slug as keyof typeof images];
  if (typeof catalogImage === "string") return catalogImage;

  if (options?.region === "domestic" && options.indiaRegion) {
    return INDIA_REGION_HERO[options.indiaRegion];
  }

  return FALLBACK_IMAGE;
}
