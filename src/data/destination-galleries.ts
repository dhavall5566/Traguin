/**
 * Five unique, destination-accurate photos per region.
 * Every photo ID appears exactly once across this file — no shared beach/mountain stock.
 * Matterhorn (417173) is reserved for Switzerland only.
 */
const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80`;

export const destinationGalleries: Record<string, readonly string[]> = {
  switzerland: [
    p(417173),
    p(2835752),
    p(1365425),
    p(5728978),
    u("1506905925346-21bda4d32df4"),
  ],
  japan: [
    u("1540959736712-19563eedd508"),
    u("1536098598794-41711c91d3fd"),
    u("1545569341-9eb8b30979d2"),
    u("1542051841853-71698feba9a4"),
    u("1573843981261-be4fdf97ebda"),
  ],
  maldives: [p(1287461), p(1032650), p(1174730), p(3251930), p(4578819)],
  dubai: [
    u("1512453979798-5ea266f8880c"),
    p(338504),
    p(1453875),
    p(3768111),
    p(2307944),
  ],
  bali: [p(3608263), p(2484456), p(2166553), p(2752852), p(2766971)],
  kashmir: [p(6738359), p(1578556), p(2992815), p(1024993), p(2885324)],
  thailand: [
    u("1552465011-b4e21bf6e79a"),
    p(1040880),
    p(2175682),
    p(1764207),
    p(3227646),
  ],
  vietnam: [p(3787839), p(3832461), p(2448709), p(2666816), p(3754117)],
  singapore: [p(259447), p(1823384), p(1564507), p(2132465), p(2878545)],
  kerala: [
    u("1717069541470-9b1a2b085e1f"),
    p(960733),
    p(4577436),
    p(2785317),
    p(4497193),
  ],
  goa: [p(248797), p(1017636), p(2766253), p(3808009), p(1643681)],
  ladakh: [p(2387873), p(1708592), p(2666297), p(7647895), p(2864446)],
  himachal: [
    p(3574440),
    p(4877062),
    p(7170023),
    u("1657894736581-ccc35d62d9e2"),
    p(818342),
  ],
  mediterranean: [p(3601425), p(1018698), p(1486975), p(2835794), p(3153803)],
  "asia-pacific": [p(7653644), p(2862686), p(3581365), p(1943949), p(2373715)],
};

/** Primary thumbnail / hero — first curated frame for a destination */
export function getDestinationPrimaryImage(destinationId: string, fallback = ""): string {
  return destinationGalleries[destinationId]?.[0] ?? fallback;
}
