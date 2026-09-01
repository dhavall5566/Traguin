const pexels = (id: number, width = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=${width}&q=80`;

/** Neutral travel placeholder, not tied to any single destination */
export const FALLBACK_IMAGE = pexels(2387866);

export const images = {
  hero: unsplash("1469854523086-cc02fe5d8800", 1920),
  /** About page hero — alpine nature landscape */
  aboutHero: unsplash("1506905925346-21bda4d32df4", 1920),
  travel: pexels(2387866, 1920),
  /** Moraine Lake, Plan My Journey CTA background */
  plannerCta: pexels(1365425, 3840),

  /** Home region split cards — vivid editorial backgrounds */
  homeRegionDomestic: pexels(1271619),
  homeRegionInternational: unsplash("1552465011-b4e21bf6e79a", 1600),

  // Domestic, distinct verified photos
  kashmir: unsplash("1506466010722-395aa2bef877"),
  kerala: unsplash("1593693401060-9fc28cf9e368"),
  goa: pexels(248797),
  ladakh: unsplash("1605649487212-47bdab064df7"),
  rajasthan: unsplash("1545126178-862cdb469409"),
  maharashtra: unsplash("1570168007204-dfb528c6958f"),
  "dadra-and-nagar-haveli": unsplash("1441974231531-c6227db76b6e"),
  "daman-and-diu": unsplash("1694931537785-ca96d985b52c"),
  "andaman-and-nicobar": unsplash("1545762374-d18079617da8"),
  lakshadweep: unsplash("1572025310208-2fd6b91764c1"),
  "tamil-nadu": unsplash("1572146462570-2129a547e6dd"),
  "andhra-pradesh": unsplash("1609854534028-b512f5246abc"),
  karnataka: unsplash("1580294647332-8a399cd9ed45"),
  puducherry: unsplash("1569157087866-f4a8e9250605"),
  himachal: unsplash("1722915767859-08a59870d70b"),
  haryana: unsplash("1500382017468-9049fed747ef"),
  punjab: unsplash("1623059508779-2542c6e83753"),
  delhi: unsplash("1587474260584-136574528ed5"),
  "uttar-pradesh": unsplash("1564507592333-c60657eea523"),
  uttarakhand: unsplash("1582510003544-4d00b7f74220"),
  chhattisgarh: unsplash("1673462107499-97848ff888b9"),
  jharkhand: unsplash("1621578847110-61f6cf5a3d9e"),
  "madhya-pradesh": unsplash("1672215051880-7594629a2ffb"),
  "west-bengal": unsplash("1561289023-56c2e530bc8a"),
  odisha: unsplash("1601815264039-67c8ba1a7f98"),
  assam: unsplash("1637391783805-f1393be00fcf"),
  sikkim: unsplash("1585914285309-4b1fe30b53ed"),
  bihar: unsplash("1663026334663-5026b4f43ac6"),
  "arunachal-pradesh": unsplash("1626761627604-f27d98885f4b"),

  // International, distinct verified photos
  bali: pexels(4244164),
  dubai: unsplash("1512453979798-5ea266f8880c"),
  switzerland: pexels(417173),
  thailand: unsplash("1552465011-b4e21bf6e79a"),
  vietnam: pexels(3787839),
  singapore: pexels(259447),

  australia: unsplash("1506973035872-a4ec16b8e8d9", 1400),
  canada: unsplash("1519832979-8f9939d45f06", 1400),

  beach: pexels(1450360),

  statueOfUnityCircuit: "/packages/statue-of-unity-circuit.png",

  // Experience showcase cards (local, real TRAGUIN photos)
  experienceGroupTours: "/experiences/group-tours.png",
  experiencePrivateLuxe: "/experiences/private-luxe.png",
  /** Travel Expert page hero — luxury resort, warm editorial */
  travelExpertHero: unsplash("1520250497591-112f2f40a3f4", 1920),
  /** Travel Expert service photography */
  serviceBespoke: unsplash("1582719508461-905c673771fd", 1400),
  serviceSkyCharter: unsplash("1436491865332-7a61a109cc05", 1400),
  serviceYacht: unsplash("1605281317010-fe5ffe798166", 1400),
  serviceChauffeur: unsplash("1449965408869-eaa3f722e40d", 1400),
  servicePrivateAccess: unsplash("1414235077428-338989a2e8c0", 1400),
  /** Travel Expert — visa & paperwork */
  serviceVisa: unsplash("1450101499163-c8848c66ca85", 1400),
  /** Travel Expert + corporate/MICE programs */
  serviceCorporateEvent: unsplash("1511578314322-379afb476865", 1400),
  experienceCorporate: unsplash("1511578314322-379afb476865", 1400),
  experienceSchool: pexels(8199572, 1400),

  couple1: unsplash("1524504388940-b1c1722653e1", 400),
  man1: unsplash("1507003211169-0a1dd7228f2d", 400),
  woman1: unsplash("1438761681033-6461ffad8d80", 400),
  couple2: unsplash("1472099645785-5658abf4ff4e", 400),

  /** Niki travel expert agent avatar (local professional headshot) */
  nikiAvatar: "/niki-avatar.jpg",
} as const;
