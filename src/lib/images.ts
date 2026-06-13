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

  // International, distinct verified photos
  bali: pexels(3608263),
  dubai: unsplash("1512453979798-5ea266f8880c"),
  switzerland: pexels(417173),
  thailand: unsplash("1552465011-b4e21bf6e79a"),
  vietnam: pexels(3787839),
  singapore: pexels(259447),

  beach: pexels(1450360),

  // Experience showcase bento grid
  experienceGroupTours: pexels(3184339, 1400),
  experiencePrivateLuxe: pexels(7061662, 1400),
  experienceCorporate: pexels(1181677, 1400),
  experienceSchool: pexels(8199572, 1400),

  couple1: unsplash("1524504388940-b1c1722653e1", 400),
  man1: unsplash("1507003211169-0a1dd7228f2d", 400),
  woman1: unsplash("1438761681033-6461ffad8d80", 400),
  couple2: unsplash("1472099645785-5658abf4ff4e", 400),

  /** Niki travel expert agent avatar (local professional headshot) */
  nikiAvatar: "/niki-avatar.jpg",
} as const;
