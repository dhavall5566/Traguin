/**
 * Curated hero images for specific itineraries / packages when CMS media
 * is missing, shared, or mismatched with the journey description.
 */
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80`;

/** Itinerary slug → hero URL */
export const ITINERARY_HERO_BY_SLUG: Record<string, string> = {
  "gj-005-divine-statue-of-unity-itinerary": "/packages/statue-of-unity-circuit.png",

  // Australia — one landmark per package matching highlights
  "au-001-australia-highlights-itinerary": u("1506973035872-a4ec16b8e8d9"), // Sydney Opera House + harbour
  "au-002-romantic-australia-itinerary": u("1624138784614-87fd1b6528f8"), // Opera House + Harbour Bridge (landscape)
  "au-003-luxury-australia-itinerary": u("1546026423-cc4642628d2b"), // Great Barrier Reef coral
  "au-004-australia-family-explorer-itinerary": u("1555851121-8a44933080f1"), // Blue Mountains Three Sisters
  "au-005-grand-australia-discovery-melbourne-cairns-gold-coast-sydney-itinerary": u(
    "1542559272-819e1934ac51",
  ), // Twelve Apostles / Great Ocean Road

  // France — one landmark per package matching highlights
  "fr-001-paris-highlights-itinerary": u("1551634979-2b11f8c946fe"), // Louvre Pyramid
  "fr-002-romantic-paris-itinerary": u("1502602898657-3e91760cbb34"), // Eiffel Tower at dusk
  "fr-003-luxury-france-itinerary": u("1556716740-b10efdb832f9"), // Palace of Versailles
  "fr-004-paris-swiss-family-itinerary": u("1507039915464-9d829b6d2d78"), // Swiss / Alpine peaks
  "fr-005-grand-france-itinerary": u("1596436831831-87dd84a69101"), // Mont Saint-Michel

  // Indonesia / Bali — distinct landmark per package (CMS heroes were heavily shared)
  "id-001-premium-bali-honeymoon-itinerary": u("1552272492-3053fbacbf4b"), // Beach sunset silhouette
  "id-002-bali-ubud-love-escape-itinerary": u("1555400038-63f5ba517a47"), // Tegalalang rice terraces
  "id-005-premium-bali-itinerary": u("1537953773345-d172ccf13cf1"), // Lempuyang / Gates of Heaven
  "id-006-bali-girls-escape-itinerary": u("1546484475-7f7bd55792da"), // Beach parasols & loungers
  "id-007-luxury-bali-retreat-itinerary": u("1571984405176-5958bd9ac31d"), // Oceanfront pool palms
  "id-008-luxury-bali-villa-retreat-itinerary": u("1634671651144-adbeca8623cb"), // Aerial villa pool
  "id-009-senior-citizen-relax-bali-escape-itinerary": u("1613200490958-acbb44189c7b"), // Calm beach day
  "id-010-premium-bali-adventure-tour-itinerary": u("1554481923-a6918bd997bc"), // Bali swing
  "id-011-best-bali-beaches-coastal-escape-itinerary": u("1573790387438-4da905039392"), // Diamond Beach cliffs
  "id-012-bali-romantic-tour-package-itinerary": u("1518548419970-58e3b4079ab2"), // Tanah Lot sunset
  "id-013-bali-family-tour-package-itinerary": u("1554931670-4ebfabf6e7a9"), // Jungle waterfall
  "id-014-luxury-yoga-wellness-bali-retreat-itinerary": u("1711609110590-5ad5c4599e56"), // Ulun Danu Bratan
  "id-015-ultimate-bali-luxury-escapes-itinerary": u("1539367628448-4bc5c9d171c8"), // Cliff coastline aerial
  "id-016-bali-lombok-ultimate-family-vacation-itinerary": u("1577717903315-1691ae25ab3f"), // Nusa Penida turquoise bay
  "id-017-luxury-couple-bali-package-itinerary": u("1604999333679-b86d54738315"), // Lakeside temple
  "id-018-bali-fixed-departure-group-package-itinerary": u("1532186651327-6ac23687d189"), // Water temple
  "id-019-ladies-bali-retreat-itinerary": u("1558005530-a7958896ec60"), // Misty rice terraces dawn
  "id-020-grand-bali-premium-tour-itinerary": u("1559628233-eb1b1a45564b"), // Aerial rice terraces

  // Italy — one landmark per package
  "it-001-italy-highlights-itinerary": u("1515542622106-78bda8ba0e5b"), // Colosseum, Rome
  "it-002-romantic-italy-itinerary": u("1498307833015-e7b400441eb8"), // Venice gondolas at sunset
  "it-003-luxury-italy-itinerary": u("1549893072-4bc678117f45"), // Portofino colourful harbour
  "it-004-italy-classical-family-itinerary": u("1687817997684-c9335cce7c5c"), // Florence Duomo skyline
  "it-005-grand-italy-itinerary": u("1516483638261-f4dbaf036963"), // Manarola / Cinque Terre

  // Singapore — distinct landmark per package (CMS heroes were heavily shared)
  "sg-001-singapore-highlights-itinerary": u("1572148884483-794c9b6c6963"), // Marina Bay Sands
  "sg-002-singapore-sentosa-itinerary": u("1595304101940-c3ac099bf2f7"), // Sentosa-style palm beach
  "sg-003-singapore-universal-studios-itinerary": u("1707412924066-13d9e3e58257"), // Universal Studios Singapore
  "sg-004-singapore-melbourne-itinerary": u("1595434971780-79d5c20c5090"), // Melbourne skyline
  "sg-005-luxury-singapore-itinerary": u("1542114740389-9b46fb1e5be7"), // ArtScience Museum dusk
  "sg-006-singapore-explorer-itinerary": u("1565967511849-76a60a516170"), // Merlion
  "sg-007-singapore-malaysia-itinerary": u("1597148543182-830ef7bbb904"), // Petronas Twin Towers
  "sg-008-singapore-ladies-shopping-itinerary": u("1705148975653-0c1914e4d8f5"), // Festive shopping street lights
  "sg-009-singapore-leisure-itinerary": u("1562474541-07ed748b1d46"), // Gardens by the Bay night
  "sg-010-singapore-educational-itinerary": u("1559329007-8707443dc28e"), // Gardens by the Bay day
  "sg-011-singapore-sentosa-fun-itinerary": u("1662385834577-0c6628d57eab"), // Resort pool / lagoon
  "sg-012-marina-bay-luxury-itinerary": u("1496939376851-89342e90adcd"), // Marina Bay luxury skyline
  "sg-013-singapore-deluxe-family-itinerary": u("1775306963755-8897be3967bb"), // Merlion at night
  "sg-014-singapore-corporate-itinerary": u("1554132634-4f56074b1652"), // Modern glass skyline
  "sg-015-grand-singapore-family-itinerary": u("1499359875449-10bbeb21501e"), // Supertree Grove night

  // Malaysia — distinct landmark per package (CMS heroes were heavily shared)
  "my-001-kuala-lumpur-genting-itinerary": u("1604493691601-c36ddcfc0445"), // Genting cable car over jungle
  "my-002-malaysia-discovery-itinerary": u("1546273300-70f00c0fc1a0"), // Petronas Twin Towers
  "my-003-kuala-lumpur-langkawi-itinerary": u("1587437043326-7e9f2730725c"), // Langkawi island greenery
  "my-004-langkawi-romance-itinerary": u("1647878872662-50d50c74d40e"), // Langkawi ocean viewpoint
  "my-005-malaysia-luxury-itinerary": u("1741158510208-d3fe871899b2"), // Petronas evening skyline
  "my-006-malaysia-shopping-itinerary": u("1562060726-e47264af32bd"), // KL city aerial
  "my-007-malaysia-relax-senior-itinerary": u("1470087167738-6aa485ff65dc"), // Cameron Highlands tea fields
  "my-008-malaysia-family-fun-itinerary": u("1561568005-0ef2568fd868"), // Theme-park / carnival fun
  "my-009-langkawi-adventure-itinerary": u("1622665645573-b0b5dea09d98"), // Langkawi SkyCab over canopy
  "my-010-grand-malaysia-luxury-itinerary": u("1596422846543-75c6fc197f07"), // KL twilight skyline

  // South Africa — one landmark per package
  "za-001-south-africa-family-itinerary": u("1626894169601-482d26b23f35"), // Cape Town harbour & mountain
  "za-002-south-africa-honeymoon-itinerary": u("1576485375217-d6a95e34d043"), // Clifton Beach / Twelve Apostles
  "za-003-cape-town-safari-itinerary": u("1710076387744-7c4e3195e3a2"), // Safari lions
  "za-004-cape-town-safari-premium-itinerary": u("1571957493901-4cc77844597b"), // Safari giraffe
  "za-005-grand-south-africa-itinerary": u("1759440038373-5c8a325c5c01"), // Table Mountain, Cape Town

  // South Korea — one landmark per package
  "kr-001-seoul-highlights-itinerary": u("1638964663550-e2123ac8900b"), // Gyeongbokgung Palace, Seoul
  "kr-002-romantic-korea-itinerary": u("1644765662414-19212b854c64"), // Tree-lined romantic path (Nami-style)
  "kr-003-south-korea-luxury-itinerary": u("1748504801632-00c2c15f6561"), // Seoul neon night street
  "kr-005-premium-south-korea-itinerary": u("1570191913384-7b4ff11716e7"), // Namsan / Seoul Tower

  // Switzerland — one landmark per package
  "ch-001-swiss-highlights-itinerary": u("1530122037265-a5f1f91d3b99"), // Lauterbrunnen valley
  "ch-002-romantic-switzerland-itinerary": u("1585951619576-6e961950cb60"), // Matterhorn
  "ch-003-luxury-switzerland-itinerary": u("1684871640048-f298aaa8b03c"), // Lakeside city & Alps aerial
  "ch-004-jungfrau-explorer-family-tour-itinerary": u("1593186344142-ef775a6e596f"), // Jungfrau region train in snow
  "ch-005-grand-switzerland-tour-itinerary": u("1607585011081-241d2bacb7de"), // Alpine village & peaks
  // Thailand — unique heroes per package
  "th-001-bangkok-pattaya-itinerary": u("1692640480932-7d33837179de"),
  "th-002-bangkok-pattaya-itinerary": u("1642391326189-46e163cad59f"),
  "th-003-bangkok-phuket-itinerary": u("1706117040529-69ee35ad9aa3"),
  "th-004-phuket-krabi-itinerary": u("1708996638598-f8001463e0ff"),
  "th-005-thailand-premium-itinerary": u("1705599210857-666ec77b6a9d"),
  "th-006-phuket-honeymoon-itinerary": u("1628221556371-ef4c328d9019"),
  "th-007-phuket-krabi-honeymoon-itinerary": u("1664799420158-8f7b79ee3e6f"),
  "th-008-thailand-romance-itinerary": u("1628358142396-1c2b8a20bc6d"),
  "th-009-girls-trip-thailand-itinerary": "/packages/th-009-girls-trip-thailand.jpg",
  "th-010-phuket-ladies-escape-phuket-patong-phi-phi-islands-james-bond-island-itinerary": u("1563315001-ab59cc08977f"),
  "th-011-relax-thailand-itinerary": u("1626815233554-fbe3fdb5b15c"),
  "th-012-luxury-phuket-retreat-itinerary": u("1743178207913-9afc6b15f3d0"),
  "th-013-bangkok-phuket-package-bangkok-chao-phraya-river-phuket-phi-phi-islands-itinerary": u("1563492065599-3520f775eeed"),
  "th-014-phuket-phi-phi-islands-krabi-james-bond-island-koh-yao-noi-itinerary": u("1598970605070-a38a6ccd3a2d"),
  "th-015-krabi-adventure-itinerary-ao-nang-bay-railay-peninsula-koh-hong-lagoons-tiger-cave-peak-itinerary": u("1562602833-0f4ab2fc46e3"),
  "th-016-pattaya-beach-coral-island-nong-nooch-columbia-pictures-aquaverse-itinerary": u("1601224335112-b74158e231ec"),
  "th-017-coral-island-special-pattaya-beach-coral-island-ultra-escape-nong-nooch-gardens-underwater-world-itinerary": u("1613672803979-a6edfc5a179b"),
  "th-018-pattaya-beach-coral-island-nong-nooch-columbia-pictures-aquaverse-itinerary": u("1612161330631-9186c513de7f"),
  "th-019-thailand-incentive-tour-bangkok-chao-phraya-river-pattaya-coral-island-private-retreat-itinerary": u("1714672709462-de21a12a1339"),
  "th-020-bangkok-science-museums-pattaya-coral-island-eco-exploration-itinerary": u("1582468546235-9bf31e5bc4a1"),
  "th-021-bangkok-krabi-family-package-bangkok-chao-phraya-river-krabi-ao-nang-beach-4-islands-itinerary": u("1580327942498-53a877c6d0ce"),
  "th-022-phuket-family-fun-package-phuket-patong-phi-phi-islands-phang-nga-bay-carnival-magic-itinerary": u("1598188475294-2359dda7c791"),
  "th-023-chiang-mai-explorer-chiang-mai-doi-suthep-elephant-nature-park-chiang-rai-golden-triangle-itinerary": u("1736128023093-9a2d76b20cf2"),
  "th-024-koh-samui-escape-chaweng-beach-angthong-national-marine-park-koh-tan-fishermans-village-itinerary": u("1591233244187-ffd622c51fbd"),
  "th-025-koh-samui-romance-chaweng-beach-angthong-marine-reserve-koh-tan-private-cruise-fisherman-s-village-itinerary": u("1644027612496-93dfa3d6a3ae"),
  "th-026-luxury-koh-samui-tour-package-chaweng-beach-choeng-mon-angthong-marine-park-koh-tao-private-cruise-itinerary": u("1636286719058-7bb6ba2004fa"),
  "th-027-iconsiam-siam-paragon-emsphere-chatuchak-weekend-market-itinerary": u("1579077926357-365f07b70b01"),
  "th-028-phuket-cape-panwa-bang-tao-bay-racha-yai-island-itinerary": u("1704392300340-88ac6bc60b5b"),
  "th-029-chiang-rai-the-golden-triangle-mekong-river-doi-mae-salong-khun-korn-waterfall-itinerary": u("1619400521895-d17d2f7be1cc"),
  "th-030-thailand-tour-bangkok-phuket-phi-phi-islands-phang-nga-bay-krabi-itinerary": u("1651377001727-ef3a8ef0872d"),
  "th-031-krabi-family-vacation-ao-nang-bay-railay-peninsula-koh-hong-lagoons-emerald-pool-itinerary": u("1579657191653-01d1746c727e"),
  "th-032-phuket-phi-phi-islands-family-tour-phuket-patong-beach-phi-phi-islands-maya-bay-james-bond-island-itinerary": u("1633617374330-04d0f6368f55"),
  "th-033-romantic-krabi-honeymoon-ao-nang-bay-railay-peninsula-koh-hong-lagoons-sunset-catamaran-itinerary": u("1658211342743-b31a9a654c63"),
  "th-034-thailand-fixed-departure-bangkok-pattaya-coral-island-marine-discovery-itinerary": u("1611551759932-57ebf0ac6bef"),
  "th-035-bangkok-pattaya-loy-krathong-songkran-festive-experience-cultural-galas-itinerary": u("1574083085337-1aca04cd68e0"),
  "th-036-phuket-luxury-package-phuket-cape-panwa-phang-nga-bay-racha-yai-private-island-itinerary": u("1732723358218-a1ae7606884b"),
  "th-037-bangkok-hua-hin-family-package-bangkok-grand-palace-hua-hin-beach-maruekhathaiyawan-palace-itinerary": u("1686924878079-eafa46aaa3c3"),
  "th-038-phuket-leisure-retreat-phuket-beachfront-old-town-heritage-scenic-bay-cruises-botanical-gardens-itinerary": u("1651376318405-f1055f37a511"),
  "th-039-phuket-phi-phi-islands-phang-nga-bay-coral-island-high-octane-action-itinerary": u("1482238069176-719f01722167"),
  "th-040-grand-thailand-tour-bangkok-chiang-mai-phuket-phi-phi-islands-phang-nga-bay-itinerary": u("1552465011-b4e21bf6e79a"),

  // Turkey — one landmark per package
  "tr-001-turkey-highlights-itinerary": u("1623621534850-d325a1980c7e"), // Hagia Sophia, Istanbul
  "tr-002-romantic-turkey-itinerary": u("1526048598645-62b31f82b8f5"), // Cappadocia hot air balloons
  "tr-003-luxury-turkey-itinerary": u("1564407727371-3eece6c58961"), // Bosphorus & mosque, Istanbul
  "tr-004-turkey-family-explorer-itinerary": u("1466442929976-97f336a657be"), // Blue Mosque / Istanbul mosques
  "tr-005-grand-turkey-itinerary": u("1699519324068-8cade0601b53"), // Cappadocia balloon valley

  // UAE / Dubai — distinct landmark per package
  "uae-001-dubai-essentials-itinerary": u("1512453979798-5ea266f8880c"), // Burj Khalifa skyline
  "uae-002-dubai-abu-dhabi-itinerary": u("1590075865003-e48277faa558"), // Sheikh Zayed Grand Mosque
  "uae-003-romantic-dubai-honeymoon-itinerary": u("1518684079-3c830dcef090"), // Burj Al Arab
  "uae-004-luxury-dubai-itinerary": "/packages/uae-004-luxury-dubai-tour.jpg",
  "uae-005-dubai-shopping-festival-itinerary": u("1718564257683-1e4caf9b049a"), // Dubai fountain / mall plaza
  "uae-006-dubai-family-itinerary": u("1628859017536-c2f1d69f3c84"), // Dubai Frame
  "uae-007-leisure-dubai-senior-itinerary": u("1667587139742-e671d6cd2039"), // Beachfront skyline
  "uae-008-dubai-desert-adventure-itinerary": u("1549944850-84e00be4203b"), // Desert camels
  "uae-009-corporate-dubai-mice-itinerary": u("1462007895615-c8c073bebcd8"), // Dubai night skyline
  "uae-010-grand-dubai-itinerary": u("1459787915554-b34915863013"), // Dubai Marina aerial

  // USA — one landmark per package
  "us-001-east-coast-usa-itinerary": u("1492217072584-7ff26c10eb75"), // Statue of Liberty, New York
  "us-002-west-coast-usa-itinerary": u("1521747116042-5a810fda9664"), // Golden Gate Bridge, San Francisco
  "us-004-luxury-usa-itinerary": u("1581351721010-8cf859cb14a4"), // Las Vegas Strip at night

  // Kashmir — domestic packages
  "jk-003-srinagar-pahalgam-gulmarg-dal-lake-itinerary": "/packages/jk-003-srinagar-pahalgam-gulmarg-dal-lake.jpg",

  // Goa — domestic packages
  "ga-004-luxury-south-goa-private-sanctuary-itinerary": "/packages/ga-004-luxury-south-goa-private-sanctuary.jpg",

  // Kerala — domestic packages
  "kl-001-munnar-thekkady-alleppey-family-itinerary": "/packages/kl-001-munnar-thekkady-alleppey-family.webp",

  // Vietnam — distinct landmark per package
  "vn-001-vietnam-explorer-itinerary": u("1643029891412-92f9a81a8c16"), // Ha Long Bay junks & karsts
  "vn-002-vietnam-highlights-itinerary": u("1531737212413-667205e1cda7"), // Hang Mua stairs, Ninh Binh
  "vn-003-romantic-vietnam-itinerary": "/packages/vn-003-romantic-vietnam-couple-tour.jpg",
  "vn-004-luxury-vietnam-itinerary": u("1559592413-7cec4d0cae2b"), // Golden Bridge, Ba Na Hills
  "vn-005-vietnam-ladies-escape-itinerary": u("1618165220283-e85246c4171c"), // Multi-tier pagoda with lanterns
  "vn-006-vietnam-family-highlights-itinerary": u("1557750255-c76072a7aad1"), // Ninh Binh water pavilion
  "vn-007-vietnam-extended-highlights-itinerary": u("1509030450996-dd1a26dda07a"), // Hanoi skyline at sunset
  "vn-008-vietnam-adventure-itinerary": u("1609412058473-c199497c3c5d"), // Sapa rice terraces in mist
  "vn-009-vietnam-senior-leisure-itinerary": u("1616486410185-81af2d32a2af"), // Turtle Tower, Hoan Kiem Lake
  "vn-010-grand-vietnam-itinerary": u("1675111066042-9baa4c343157"), // Ha Long Bay panoramic islands
};

/** Homepage hero slider only — does not affect package/itinerary detail pages */
export const HOMEPAGE_PACKAGE_HERO_BY_SLUG: Record<string, string> = {
  "uae-004-luxury-dubai-tour": "/packages/uae-004-luxury-dubai-tour-homepage.jpg",
  "uae-004-luxury-dubai-itinerary": "/packages/uae-004-luxury-dubai-tour-homepage.jpg",
  "ga-004-luxury-south-goa-private-sanctuary": "/packages/ga-004-luxury-south-goa-private-sanctuary-homepage.webp",
  "ga-004-luxury-south-goa-private-sanctuary-itinerary":
    "/packages/ga-004-luxury-south-goa-private-sanctuary-homepage.webp",
  "jk-003-srinagar-pahalgam-gulmarg-dal-lake": "/packages/jk-003-srinagar-pahalgam-gulmarg-dal-lake-homepage.webp",
  "jk-003-srinagar-pahalgam-gulmarg-dal-lake-itinerary":
    "/packages/jk-003-srinagar-pahalgam-gulmarg-dal-lake-homepage.webp",
  "kl-001-munnar-thekkady-alleppey-family": "/packages/kl-001-munnar-thekkady-alleppey-family-homepage.webp",
  "kl-001-munnar-thekkady-alleppey-family-itinerary":
    "/packages/kl-001-munnar-thekkady-alleppey-family-homepage.webp",
  "th-009-girls-trip-thailand": "/packages/th-009-girls-trip-thailand-homepage.webp",
  "th-009-girls-trip-thailand-itinerary": "/packages/th-009-girls-trip-thailand-homepage.webp",
  "vn-003-romantic-vietnam-couple-tour": "/packages/vn-003-romantic-vietnam-couple-tour-homepage.webp",
  "vn-003-romantic-vietnam-itinerary": "/packages/vn-003-romantic-vietnam-couple-tour-homepage.webp",
};

export function resolveHomepagePackageHero(
  itinerarySlug?: string | null,
  packageSlug?: string | null,
): string | undefined {
  if (packageSlug && HOMEPAGE_PACKAGE_HERO_BY_SLUG[packageSlug]) {
    return HOMEPAGE_PACKAGE_HERO_BY_SLUG[packageSlug];
  }
  if (itinerarySlug && HOMEPAGE_PACKAGE_HERO_BY_SLUG[itinerarySlug]) {
    return HOMEPAGE_PACKAGE_HERO_BY_SLUG[itinerarySlug];
  }
  return undefined;
}

/** Package slug → hero URL (homepage / package cards) */
export const PACKAGE_HERO_BY_SLUG: Record<string, string> = {
  "gj-005-divine-statue-of-unity-circuit": "/packages/statue-of-unity-circuit.png",
  "au-001-australia-highlights-family-tour": ITINERARY_HERO_BY_SLUG["au-001-australia-highlights-itinerary"],
  "au-002-romantic-australia-honeymoon": ITINERARY_HERO_BY_SLUG["au-002-romantic-australia-itinerary"],
  "au-003-luxury-australia-grand-expedition": ITINERARY_HERO_BY_SLUG["au-003-luxury-australia-itinerary"],
  "au-004-australia-family-explorer": ITINERARY_HERO_BY_SLUG["au-004-australia-family-explorer-itinerary"],
  "au-005-grand-australia-discovery-melbourne-cairns-gold-coast-sydney":
    ITINERARY_HERO_BY_SLUG[
      "au-005-grand-australia-discovery-melbourne-cairns-gold-coast-sydney-itinerary"
    ],
  "fr-001-paris-highlights-family-tour": ITINERARY_HERO_BY_SLUG["fr-001-paris-highlights-itinerary"],
  "fr-002-romantic-paris-honeymoon": ITINERARY_HERO_BY_SLUG["fr-002-romantic-paris-itinerary"],
  "fr-003-luxury-france-tour": ITINERARY_HERO_BY_SLUG["fr-003-luxury-france-itinerary"],
  "fr-004-paris-swiss-family-tour": ITINERARY_HERO_BY_SLUG["fr-004-paris-swiss-family-itinerary"],
  "fr-005-grand-france-tour": ITINERARY_HERO_BY_SLUG["fr-005-grand-france-itinerary"],
  "id-001-premium-bali-honeymoon": ITINERARY_HERO_BY_SLUG["id-001-premium-bali-honeymoon-itinerary"],
  "id-002-bali-ubud-love-escape": ITINERARY_HERO_BY_SLUG["id-002-bali-ubud-love-escape-itinerary"],
  "id-005-premium-bali-family-tour": ITINERARY_HERO_BY_SLUG["id-005-premium-bali-itinerary"],
  "id-006-bali-girls-escape": ITINERARY_HERO_BY_SLUG["id-006-bali-girls-escape-itinerary"],
  "id-007-luxury-bali-retreat": ITINERARY_HERO_BY_SLUG["id-007-luxury-bali-retreat-itinerary"],
  "id-008-luxury-bali-villa-retreat": ITINERARY_HERO_BY_SLUG["id-008-luxury-bali-villa-retreat-itinerary"],
  "id-009-senior-citizen-relax-bali-escape":
    ITINERARY_HERO_BY_SLUG["id-009-senior-citizen-relax-bali-escape-itinerary"],
  "id-010-premium-bali-adventure-tour":
    ITINERARY_HERO_BY_SLUG["id-010-premium-bali-adventure-tour-itinerary"],
  "id-011-best-bali-beaches-coastal-escape":
    ITINERARY_HERO_BY_SLUG["id-011-best-bali-beaches-coastal-escape-itinerary"],
  "id-012-bali-romantic-tour-package":
    ITINERARY_HERO_BY_SLUG["id-012-bali-romantic-tour-package-itinerary"],
  "id-013-bali-family-tour-package": ITINERARY_HERO_BY_SLUG["id-013-bali-family-tour-package-itinerary"],
  "id-014-luxury-yoga-wellness-bali-retreat":
    ITINERARY_HERO_BY_SLUG["id-014-luxury-yoga-wellness-bali-retreat-itinerary"],
  "id-015-ultimate-bali-luxury-escapes":
    ITINERARY_HERO_BY_SLUG["id-015-ultimate-bali-luxury-escapes-itinerary"],
  "id-016-bali-lombok-ultimate-family-vacation":
    ITINERARY_HERO_BY_SLUG["id-016-bali-lombok-ultimate-family-vacation-itinerary"],
  "id-017-luxury-couple-bali-package":
    ITINERARY_HERO_BY_SLUG["id-017-luxury-couple-bali-package-itinerary"],
  "id-018-bali-fixed-departure-group-package":
    ITINERARY_HERO_BY_SLUG["id-018-bali-fixed-departure-group-package-itinerary"],
  "id-019-ladies-bali-retreat": ITINERARY_HERO_BY_SLUG["id-019-ladies-bali-retreat-itinerary"],
  "id-020-grand-bali-premium-tour": ITINERARY_HERO_BY_SLUG["id-020-grand-bali-premium-tour-itinerary"],
  "it-001-italy-highlights-family-tour": ITINERARY_HERO_BY_SLUG["it-001-italy-highlights-itinerary"],
  "it-002-romantic-italy-honeymoon": ITINERARY_HERO_BY_SLUG["it-002-romantic-italy-itinerary"],
  "it-003-luxury-italy-grand-expedition": ITINERARY_HERO_BY_SLUG["it-003-luxury-italy-itinerary"],
  "it-004-italy-classical-family-tour":
    ITINERARY_HERO_BY_SLUG["it-004-italy-classical-family-itinerary"],
  "it-005-grand-italy-tour": ITINERARY_HERO_BY_SLUG["it-005-grand-italy-itinerary"],
  "sg-001-singapore-highlights-family-tour":
    ITINERARY_HERO_BY_SLUG["sg-001-singapore-highlights-itinerary"],
  "sg-002-singapore-sentosa-family-tour": ITINERARY_HERO_BY_SLUG["sg-002-singapore-sentosa-itinerary"],
  "sg-003-singapore-universal-studios-special":
    ITINERARY_HERO_BY_SLUG["sg-003-singapore-universal-studios-itinerary"],
  "sg-004-singapore-melbourne-family-tour":
    ITINERARY_HERO_BY_SLUG["sg-004-singapore-melbourne-itinerary"],
  "sg-005-luxury-singapore-tour": ITINERARY_HERO_BY_SLUG["sg-005-luxury-singapore-itinerary"],
  "sg-006-singapore-explorer-tour": ITINERARY_HERO_BY_SLUG["sg-006-singapore-explorer-itinerary"],
  "sg-007-singapore-malaysia-tour": ITINERARY_HERO_BY_SLUG["sg-007-singapore-malaysia-itinerary"],
  "sg-008-singapore-ladies-shopping-tour":
    ITINERARY_HERO_BY_SLUG["sg-008-singapore-ladies-shopping-itinerary"],
  "sg-009-singapore-leisure-tour": ITINERARY_HERO_BY_SLUG["sg-009-singapore-leisure-itinerary"],
  "sg-010-singapore-educational-tour":
    ITINERARY_HERO_BY_SLUG["sg-010-singapore-educational-itinerary"],
  "sg-011-singapore-sentosa-fun-tour":
    ITINERARY_HERO_BY_SLUG["sg-011-singapore-sentosa-fun-itinerary"],
  "sg-012-marina-bay-luxury-tour": ITINERARY_HERO_BY_SLUG["sg-012-marina-bay-luxury-itinerary"],
  "sg-013-singapore-deluxe-family-tour":
    ITINERARY_HERO_BY_SLUG["sg-013-singapore-deluxe-family-itinerary"],
  "sg-014-singapore-corporate-tour": ITINERARY_HERO_BY_SLUG["sg-014-singapore-corporate-itinerary"],
  "sg-015-grand-singapore-family-tour":
    ITINERARY_HERO_BY_SLUG["sg-015-grand-singapore-family-itinerary"],
  "my-001-kuala-lumpur-genting-family-tour":
    ITINERARY_HERO_BY_SLUG["my-001-kuala-lumpur-genting-itinerary"],
  "my-002-malaysia-discovery-family-tour":
    ITINERARY_HERO_BY_SLUG["my-002-malaysia-discovery-itinerary"],
  "my-003-kuala-lumpur-langkawi-family-tour":
    ITINERARY_HERO_BY_SLUG["my-003-kuala-lumpur-langkawi-itinerary"],
  "my-004-langkawi-romance-package": ITINERARY_HERO_BY_SLUG["my-004-langkawi-romance-itinerary"],
  "my-005-malaysia-luxury-tour": ITINERARY_HERO_BY_SLUG["my-005-malaysia-luxury-itinerary"],
  "my-006-malaysia-shopping-tour": ITINERARY_HERO_BY_SLUG["my-006-malaysia-shopping-itinerary"],
  "my-007-malaysia-relax-senior-tour":
    ITINERARY_HERO_BY_SLUG["my-007-malaysia-relax-senior-itinerary"],
  "my-008-malaysia-family-fun-tour": ITINERARY_HERO_BY_SLUG["my-008-malaysia-family-fun-itinerary"],
  "my-009-langkawi-adventure-tour": ITINERARY_HERO_BY_SLUG["my-009-langkawi-adventure-itinerary"],
  "my-010-grand-malaysia-luxury-tour":
    ITINERARY_HERO_BY_SLUG["my-010-grand-malaysia-luxury-itinerary"],
  "za-001-south-africa-family-tour":
    ITINERARY_HERO_BY_SLUG["za-001-south-africa-family-itinerary"],
  "za-002-south-africa-honeymoon":
    ITINERARY_HERO_BY_SLUG["za-002-south-africa-honeymoon-itinerary"],
  "za-003-cape-town-safari-family-tour":
    ITINERARY_HERO_BY_SLUG["za-003-cape-town-safari-itinerary"],
  "za-004-cape-town-safari-premium-tour":
    ITINERARY_HERO_BY_SLUG["za-004-cape-town-safari-premium-itinerary"],
  "za-005-grand-south-africa-tour":
    ITINERARY_HERO_BY_SLUG["za-005-grand-south-africa-itinerary"],
  "kr-001-seoul-highlights-family-tour":
    ITINERARY_HERO_BY_SLUG["kr-001-seoul-highlights-itinerary"],
  "kr-002-romantic-korea-honeymoon": ITINERARY_HERO_BY_SLUG["kr-002-romantic-korea-itinerary"],
  "kr-003-south-korea-luxury-tour":
    ITINERARY_HERO_BY_SLUG["kr-003-south-korea-luxury-itinerary"],
  "kr-005-premium-south-korea-tour":
    ITINERARY_HERO_BY_SLUG["kr-005-premium-south-korea-itinerary"],
  "ch-001-swiss-highlights-family-tour":
    ITINERARY_HERO_BY_SLUG["ch-001-swiss-highlights-itinerary"],
  "ch-002-romantic-switzerland-honeymoon":
    ITINERARY_HERO_BY_SLUG["ch-002-romantic-switzerland-itinerary"],
  "ch-003-luxury-switzerland-tour":
    ITINERARY_HERO_BY_SLUG["ch-003-luxury-switzerland-itinerary"],
  "ch-004-jungfrau-explorer-family-tour":
    ITINERARY_HERO_BY_SLUG["ch-004-jungfrau-explorer-family-tour-itinerary"],
  "ch-005-grand-switzerland-tour":
    ITINERARY_HERO_BY_SLUG["ch-005-grand-switzerland-tour-itinerary"],
  "th-001-bangkok-pattaya-family-tour": ITINERARY_HERO_BY_SLUG["th-001-bangkok-pattaya-itinerary"],
  "th-002-bangkok-pattaya-family-tour": ITINERARY_HERO_BY_SLUG["th-002-bangkok-pattaya-itinerary"],
  "th-003-bangkok-phuket-family-tour": ITINERARY_HERO_BY_SLUG["th-003-bangkok-phuket-itinerary"],
  "th-004-phuket-krabi-family-tour": ITINERARY_HERO_BY_SLUG["th-004-phuket-krabi-itinerary"],
  "th-005-thailand-premium-family-tour": ITINERARY_HERO_BY_SLUG["th-005-thailand-premium-itinerary"],
  "th-006-phuket-honeymoon-package": ITINERARY_HERO_BY_SLUG["th-006-phuket-honeymoon-itinerary"],
  "th-007-phuket-krabi-honeymoon": ITINERARY_HERO_BY_SLUG["th-007-phuket-krabi-honeymoon-itinerary"],
  "th-008-thailand-romance-package": ITINERARY_HERO_BY_SLUG["th-008-thailand-romance-itinerary"],
  "th-009-girls-trip-thailand": ITINERARY_HERO_BY_SLUG["th-009-girls-trip-thailand-itinerary"],
  "th-010-phuket-ladies-escape-phuket-patong-phi-phi-islands-james-bond-island": ITINERARY_HERO_BY_SLUG["th-010-phuket-ladies-escape-phuket-patong-phi-phi-islands-james-bond-island-itinerary"],
  "th-011-relax-thailand-senior-tour": ITINERARY_HERO_BY_SLUG["th-011-relax-thailand-itinerary"],
  "th-012-luxury-phuket-retreat": ITINERARY_HERO_BY_SLUG["th-012-luxury-phuket-retreat-itinerary"],
  "th-013-bangkok-phuket-package-bangkok-chao-phraya-river-phuket-phi-phi-islands": ITINERARY_HERO_BY_SLUG["th-013-bangkok-phuket-package-bangkok-chao-phraya-river-phuket-phi-phi-islands-itinerary"],
  "th-014-phuket-phi-phi-islands-krabi-james-bond-island-koh-yao-noi": ITINERARY_HERO_BY_SLUG["th-014-phuket-phi-phi-islands-krabi-james-bond-island-koh-yao-noi-itinerary"],
  "th-015-krabi-adventure-itinerary-ao-nang-bay-railay-peninsula-koh-hong-lagoons-tiger-cave-peak": ITINERARY_HERO_BY_SLUG["th-015-krabi-adventure-itinerary-ao-nang-bay-railay-peninsula-koh-hong-lagoons-tiger-cave-peak-itinerary"],
  "th-016-pattaya-beach-coral-island-nong-nooch-columbia-pictures-aquaverse": ITINERARY_HERO_BY_SLUG["th-016-pattaya-beach-coral-island-nong-nooch-columbia-pictures-aquaverse-itinerary"],
  "th-017-coral-island-special-pattaya-beach-coral-island-ultra-escape-nong-nooch-gardens-underwater-world": ITINERARY_HERO_BY_SLUG["th-017-coral-island-special-pattaya-beach-coral-island-ultra-escape-nong-nooch-gardens-underwater-world-itinerary"],
  "th-018-pattaya-beach-coral-island-nong-nooch-columbia-pictures-aquaverse": ITINERARY_HERO_BY_SLUG["th-018-pattaya-beach-coral-island-nong-nooch-columbia-pictures-aquaverse-itinerary"],
  "th-019-thailand-incentive-tour-bangkok-chao-phraya-river-pattaya-coral-island-private-retreat": ITINERARY_HERO_BY_SLUG["th-019-thailand-incentive-tour-bangkok-chao-phraya-river-pattaya-coral-island-private-retreat-itinerary"],
  "th-020-bangkok-science-museums-pattaya-coral-island-eco-exploration": ITINERARY_HERO_BY_SLUG["th-020-bangkok-science-museums-pattaya-coral-island-eco-exploration-itinerary"],
  "th-021-bangkok-krabi-family-package-bangkok-chao-phraya-river-krabi-ao-nang-beach-4-islands": ITINERARY_HERO_BY_SLUG["th-021-bangkok-krabi-family-package-bangkok-chao-phraya-river-krabi-ao-nang-beach-4-islands-itinerary"],
  "th-022-phuket-family-fun-package-phuket-patong-phi-phi-islands-phang-nga-bay-carnival-magic": ITINERARY_HERO_BY_SLUG["th-022-phuket-family-fun-package-phuket-patong-phi-phi-islands-phang-nga-bay-carnival-magic-itinerary"],
  "th-023-chiang-mai-explorer-chiang-mai-doi-suthep-elephant-nature-park-chiang-rai-golden-triangle": ITINERARY_HERO_BY_SLUG["th-023-chiang-mai-explorer-chiang-mai-doi-suthep-elephant-nature-park-chiang-rai-golden-triangle-itinerary"],
  "th-024-koh-samui-escape-chaweng-beach-angthong-national-marine-park-koh-tan-fishermans-village": ITINERARY_HERO_BY_SLUG["th-024-koh-samui-escape-chaweng-beach-angthong-national-marine-park-koh-tan-fishermans-village-itinerary"],
  "th-025-koh-samui-romance-chaweng-beach-angthong-marine-reserve-koh-tan-private-cruise-fisherman-s-village": ITINERARY_HERO_BY_SLUG["th-025-koh-samui-romance-chaweng-beach-angthong-marine-reserve-koh-tan-private-cruise-fisherman-s-village-itinerary"],
  "th-026-luxury-koh-samui-tour-package-chaweng-beach-choeng-mon-angthong-marine-park-koh-tao-private-cruise": ITINERARY_HERO_BY_SLUG["th-026-luxury-koh-samui-tour-package-chaweng-beach-choeng-mon-angthong-marine-park-koh-tao-private-cruise-itinerary"],
  "th-027-iconsiam-siam-paragon-emsphere-chatuchak-weekend-market": ITINERARY_HERO_BY_SLUG["th-027-iconsiam-siam-paragon-emsphere-chatuchak-weekend-market-itinerary"],
  "th-028-phuket-cape-panwa-bang-tao-bay-racha-yai-island": ITINERARY_HERO_BY_SLUG["th-028-phuket-cape-panwa-bang-tao-bay-racha-yai-island-itinerary"],
  "th-029-chiang-rai-the-golden-triangle-mekong-river-doi-mae-salong-khun-korn-waterfall": ITINERARY_HERO_BY_SLUG["th-029-chiang-rai-the-golden-triangle-mekong-river-doi-mae-salong-khun-korn-waterfall-itinerary"],
  "th-030-thailand-tour-bangkok-phuket-phi-phi-islands-phang-nga-bay-krabi": ITINERARY_HERO_BY_SLUG["th-030-thailand-tour-bangkok-phuket-phi-phi-islands-phang-nga-bay-krabi-itinerary"],
  "th-031-krabi-family-vacation-ao-nang-bay-railay-peninsula-koh-hong-lagoons-emerald-pool": ITINERARY_HERO_BY_SLUG["th-031-krabi-family-vacation-ao-nang-bay-railay-peninsula-koh-hong-lagoons-emerald-pool-itinerary"],
  "th-032-phuket-phi-phi-islands-family-tour-phuket-patong-beach-phi-phi-islands-maya-bay-james-bond-island": ITINERARY_HERO_BY_SLUG["th-032-phuket-phi-phi-islands-family-tour-phuket-patong-beach-phi-phi-islands-maya-bay-james-bond-island-itinerary"],
  "th-033-romantic-krabi-honeymoon-ao-nang-bay-railay-peninsula-koh-hong-lagoons-sunset-catamaran": ITINERARY_HERO_BY_SLUG["th-033-romantic-krabi-honeymoon-ao-nang-bay-railay-peninsula-koh-hong-lagoons-sunset-catamaran-itinerary"],
  "th-034-thailand-fixed-departure-bangkok-pattaya-coral-island-marine-discovery": ITINERARY_HERO_BY_SLUG["th-034-thailand-fixed-departure-bangkok-pattaya-coral-island-marine-discovery-itinerary"],
  "th-035-bangkok-pattaya-loy-krathong-songkran-festive-experience-cultural-galas": ITINERARY_HERO_BY_SLUG["th-035-bangkok-pattaya-loy-krathong-songkran-festive-experience-cultural-galas-itinerary"],
  "th-036-phuket-luxury-package-phuket-cape-panwa-phang-nga-bay-racha-yai-private-island": ITINERARY_HERO_BY_SLUG["th-036-phuket-luxury-package-phuket-cape-panwa-phang-nga-bay-racha-yai-private-island-itinerary"],
  "th-037-bangkok-hua-hin-family-package-bangkok-grand-palace-hua-hin-beach-maruekhathaiyawan-palace": ITINERARY_HERO_BY_SLUG["th-037-bangkok-hua-hin-family-package-bangkok-grand-palace-hua-hin-beach-maruekhathaiyawan-palace-itinerary"],
  "th-038-phuket-leisure-retreat-phuket-beachfront-old-town-heritage-scenic-bay-cruises-botanical-gardens": ITINERARY_HERO_BY_SLUG["th-038-phuket-leisure-retreat-phuket-beachfront-old-town-heritage-scenic-bay-cruises-botanical-gardens-itinerary"],
  "th-039-phuket-phi-phi-islands-phang-nga-bay-coral-island-high-octane-action": ITINERARY_HERO_BY_SLUG["th-039-phuket-phi-phi-islands-phang-nga-bay-coral-island-high-octane-action-itinerary"],
  "th-040-grand-thailand-tour-bangkok-chiang-mai-phuket-phi-phi-islands-phang-nga-bay": ITINERARY_HERO_BY_SLUG["th-040-grand-thailand-tour-bangkok-chiang-mai-phuket-phi-phi-islands-phang-nga-bay-itinerary"],
  "tr-001-turkey-highlights-family-tour":
    ITINERARY_HERO_BY_SLUG["tr-001-turkey-highlights-itinerary"],
  "tr-002-romantic-turkey-couple-tour":
    ITINERARY_HERO_BY_SLUG["tr-002-romantic-turkey-itinerary"],
  "tr-003-luxury-turkey-tour": ITINERARY_HERO_BY_SLUG["tr-003-luxury-turkey-itinerary"],
  "tr-004-turkey-family-explorer-tour":
    ITINERARY_HERO_BY_SLUG["tr-004-turkey-family-explorer-itinerary"],
  "tr-005-grand-turkey-tour": ITINERARY_HERO_BY_SLUG["tr-005-grand-turkey-itinerary"],
  "uae-001-dubai-essentials-family-tour":
    ITINERARY_HERO_BY_SLUG["uae-001-dubai-essentials-itinerary"],
  "uae-002-dubai-abu-dhabi-family-tour":
    ITINERARY_HERO_BY_SLUG["uae-002-dubai-abu-dhabi-itinerary"],
  "uae-003-romantic-dubai-honeymoon":
    ITINERARY_HERO_BY_SLUG["uae-003-romantic-dubai-honeymoon-itinerary"],
  "uae-004-luxury-dubai-tour": ITINERARY_HERO_BY_SLUG["uae-004-luxury-dubai-itinerary"],
  "uae-005-dubai-shopping-festival-tour":
    ITINERARY_HERO_BY_SLUG["uae-005-dubai-shopping-festival-itinerary"],
  "uae-006-dubai-family-tour": ITINERARY_HERO_BY_SLUG["uae-006-dubai-family-itinerary"],
  "uae-007-leisure-dubai-senior-tour":
    ITINERARY_HERO_BY_SLUG["uae-007-leisure-dubai-senior-itinerary"],
  "uae-008-dubai-desert-adventure-tour":
    ITINERARY_HERO_BY_SLUG["uae-008-dubai-desert-adventure-itinerary"],
  "uae-009-corporate-dubai-mice-tour":
    ITINERARY_HERO_BY_SLUG["uae-009-corporate-dubai-mice-itinerary"],
  "uae-010-grand-dubai-tour": ITINERARY_HERO_BY_SLUG["uae-010-grand-dubai-itinerary"],
  "us-001-east-coast-usa-family-tour":
    ITINERARY_HERO_BY_SLUG["us-001-east-coast-usa-itinerary"],
  "us-002-west-coast-usa-family-tour":
    ITINERARY_HERO_BY_SLUG["us-002-west-coast-usa-itinerary"],
  "us-004-luxury-usa-experience": ITINERARY_HERO_BY_SLUG["us-004-luxury-usa-itinerary"],
  "jk-003-srinagar-pahalgam-gulmarg-dal-lake":
    ITINERARY_HERO_BY_SLUG["jk-003-srinagar-pahalgam-gulmarg-dal-lake-itinerary"],
  "ga-004-luxury-south-goa-private-sanctuary":
    ITINERARY_HERO_BY_SLUG["ga-004-luxury-south-goa-private-sanctuary-itinerary"],
  "kl-001-munnar-thekkady-alleppey-family":
    ITINERARY_HERO_BY_SLUG["kl-001-munnar-thekkady-alleppey-family-itinerary"],
  "vn-001-vietnam-explorer-family-tour":
    ITINERARY_HERO_BY_SLUG["vn-001-vietnam-explorer-itinerary"],
  "vn-002-vietnam-highlights-family-tour":
    ITINERARY_HERO_BY_SLUG["vn-002-vietnam-highlights-itinerary"],
  "vn-003-romantic-vietnam-couple-tour":
    ITINERARY_HERO_BY_SLUG["vn-003-romantic-vietnam-itinerary"],
  "vn-004-luxury-vietnam-tour": ITINERARY_HERO_BY_SLUG["vn-004-luxury-vietnam-itinerary"],
  "vn-005-vietnam-ladies-escape":
    ITINERARY_HERO_BY_SLUG["vn-005-vietnam-ladies-escape-itinerary"],
  "vn-006-vietnam-family-highlights-tour":
    ITINERARY_HERO_BY_SLUG["vn-006-vietnam-family-highlights-itinerary"],
  "vn-007-vietnam-extended-highlights-tour":
    ITINERARY_HERO_BY_SLUG["vn-007-vietnam-extended-highlights-itinerary"],
  "vn-008-vietnam-adventure-expedition-tour":
    ITINERARY_HERO_BY_SLUG["vn-008-vietnam-adventure-itinerary"],
  "vn-009-vietnam-senior-leisure-tour":
    ITINERARY_HERO_BY_SLUG["vn-009-vietnam-senior-leisure-itinerary"],
  "vn-010-grand-vietnam-tour": ITINERARY_HERO_BY_SLUG["vn-010-grand-vietnam-itinerary"],
};

export function resolveCuratedItineraryHero(
  itinerarySlug?: string | null,
  packageSlug?: string | null,
): string | undefined {
  if (itinerarySlug && ITINERARY_HERO_BY_SLUG[itinerarySlug]) {
    return ITINERARY_HERO_BY_SLUG[itinerarySlug];
  }
  if (packageSlug && PACKAGE_HERO_BY_SLUG[packageSlug]) {
    return PACKAGE_HERO_BY_SLUG[packageSlug];
  }
  return undefined;
}
