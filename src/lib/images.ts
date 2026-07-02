const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=${width}&q=80`;

/** Neutral travel placeholder, not tied to any single destination */
export const FALLBACK_IMAGE = pexels(2387866);

export const images = {
  hero: unsplash("1469854523086-cc02fe5d8800", 1920),
  travel: pexels(2387866, 1920),
  /** Moraine Lake, Plan My Journey CTA background */
  plannerCta: pexels(1365425, 3840),

  /** Home region split cards — vivid editorial backgrounds */
  homeRegionDomestic: pexels(1271619),
  homeRegionInternational: pexels(2581922),

  // Domestic, distinct verified photos
  kashmir: pexels(6738359),
  kerala: unsplash("1717069541470-9b1a2b085e1f"),
  goa: pexels(248797),
  ladakh: pexels(2387873),
  rajasthan: pexels(1271619),
  himachal: pexels(3574440),
  punjab: pexels(25264894),
  delhi: pexels(1070535),
  "uttar-pradesh": pexels(316458),

  // International, distinct verified photos
  bali: pexels(4244164),
  dubai: unsplash("1512453979798-5ea266f8880c"),
  switzerland: pexels(417173),
  thailand: unsplash("1552465011-b4e21bf6e79a"),
  vietnam: pexels(3787839),
  singapore: pexels(259447),

  australia: unsplash("1523483405985-81fa17fd9aae", 1400),
  canada: unsplash("1519832979-8f9939d45f06", 1400),

  beach: pexels(1450360),

  statueOfUnityCircuit: "/packages/statue-of-unity-circuit.png",

  // Experience showcase cards (local, real TRAGUIN photos)
  experienceGroupTours: "/experiences/group-tours.png",
  experiencePrivateLuxe: "/experiences/private-luxe.png",
  /** Travel Expert page hero — concierge planning, warm editorial */
  travelExpertHero: unsplash("1520251406685-9d47b813f37d", 1920),
  /** Travel Expert service photography */
  serviceBespoke: "/experiences/private-luxe.png",
  serviceSkyCharter: pexels(46148, 1400),
  serviceYacht: pexels(3601430, 1400),
  serviceChauffeur: unsplash("1503376780353-7e6692767b70", 1400),
  servicePrivateAccess: pexels(6266317, 1400),
  /** Travel Expert — visa & paperwork */
  serviceVisa: pexels(4606725, 1400),
  /** Travel Expert + corporate/MICE programs */
  serviceCorporateEvent: pexels(2774552, 1400),
  experienceCorporate: pexels(2774552, 1400),
  experienceSchool: pexels(8199572, 1400),

  couple1: unsplash("1524504388940-b1c1722653e1", 400),
  man1: unsplash("1507003211169-0a1dd7228f2d", 400),
  woman1: unsplash("1438761681033-6461ffad8d80", 400),
  couple2: unsplash("1472099645785-5658abf4ff4e", 400),

  /** Niki travel expert agent avatar (local professional headshot) */
  nikiAvatar: "/niki-avatar.jpg",
} as const;
