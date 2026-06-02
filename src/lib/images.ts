const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=${width}&q=80`;

export const FALLBACK_IMAGE = pexels(417173);

export const images = {
  hero: unsplash("1469854523086-cc02fe5d8800", 1920),
  travel: pexels(2387866, 1920),

  // Domestic — distinct verified photos
  kashmir: pexels(6738359),
  kerala: unsplash("1717069541470-9b1a2b085e1f"),
  goa: pexels(248797),
  ladakh: pexels(2387873),
  rajasthan: pexels(1271619),
  himachal: pexels(3225517),

  // International — distinct verified photos
  bali: pexels(3608263),
  dubai: unsplash("1512453979798-5ea266f8880c"),
  switzerland: pexels(417173),
  thailand: unsplash("1552465011-b4e21bf6e79a"),
  vietnam: pexels(3787839),
  singapore: pexels(259447),

  // Moods
  luxury: pexels(271624),
  adventure: pexels(1365425),
  romantic: pexels(1024993),
  family: pexels(861308),
  wildlife: pexels(631317),
  beach: pexels(1450360),
  nature: pexels(1287145),
  spiritual: unsplash("1506905925346-21bda4d32df4"),

  couple1: unsplash("1524504388940-b1c1722653e1", 400),
  man1: unsplash("1507003211169-0a1dd7228f2d", 400),
  woman1: unsplash("1438761681033-6461ffad8d80", 400),
  couple2: unsplash("1472099645785-5658abf4ff4e", 400),
} as const;

export const domesticSplitImages = [
  { label: "Kashmir", subtitle: "Alpine valleys & lakes", src: images.kashmir },
  { label: "Kerala", subtitle: "Backwater serenity", src: images.kerala },
  { label: "Goa", subtitle: "Golden coastlines", src: images.goa },
  { label: "Ladakh", subtitle: "High-altitude desert", src: images.ladakh },
] ;

export const internationalSplitImages = [
  { label: "Bali", subtitle: "Island temples & rice terraces", src: images.bali },
  { label: "Dubai", subtitle: "Desert luxury & skyline", src: images.dubai },
  { label: "Switzerland", subtitle: "Alpine elegance", src: images.switzerland },
  { label: "Thailand", subtitle: "Golden temples & islands", src: images.thailand },
] ;

export const galleryImages = [
  images.kashmir,
  images.bali,
  images.kerala,
  images.dubai,
  images.switzerland,
  images.goa,
  images.thailand,
  images.ladakh,
  images.vietnam,
  images.rajasthan,
  images.singapore,
  images.himachal,
] as const;
