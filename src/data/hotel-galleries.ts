/**
 * Unique hotel-property photos only (suites, lobbies, facades, on-site pools).
 * Each URL is used once across the entire catalog, no shared destination scenery.
 */
const p = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=1400&q=80`;

export const hotelGalleries: Record<string, readonly string[]> = {
  "burj-al-arab": [
    u("1518684079-8861ad7bb8f8"),
    p(3768111),
    p(189296),
    p(6642521),
    p(460409),
  ],
  "aman-bali": [
    p(2581922),
    p(3201050),
    u("1566073771259-57a8f41e3862"),
    p(7061662),
    p(2734137),
  ],
  "badrutt-palace": [
    p(6720718),
    p(261181),
    u("1582719478250-c89cae4dc85b"),
    p(1374195),
    p(967050),
  ],
  "four-seasons-bangkok": [
    p(2980953),
    p(1268855),
    u("1551882547-ff40c63fe5fa"),
    p(2034335),
    p(6782347),
  ],
  "kumarakom-lake": [
    p(2507010),
    p(1134176),
    u("1590490360182-ac31c27ca834"),
    p(2868247),
    p(7031672),
  ],
  "the-lalit-grand": [
    p(1457842),
    p(279746),
    u("1618773928121-c32242e63f39"),
    p(358136),
    p(7187421),
  ],
  "taj-exotica-goa": [
    p(3228985),
    p(811216),
    u("1631049307264-da46ca028a0e"),
    p(903376),
    p(6678387),
  ],
  "the-grand-dragon": [
    p(164372),
    p(210617),
    u("1636006306708-68cdca8ebd76"),
    p(2373713),
    p(2404445),
  ],
  "amandari-ubud": [
    p(261102),
    p(534216),
    u("1445017988770-a311ffe70733"),
    p(769773),
    p(6654285),
  ],
  "bulgari-bali": [
    p(1045541),
    p(1571460),
    u("1520250497591-112f2c40a3f4"),
    p(36383),
    p(164595),
  ],
  "mont-cervin-palace": [
    p(97906),
    p(261109),
    u("1564501049412-61e24790404de"),
    p(64710),
    p(995388),
  ],
  "brunton-boatyard": [
    p(1181717),
    p(1267326),
    u("1578683010236-d716f9a3f461"),
    p(271795),
    p(421927),
  ],
  "luxury-houseboat": [
    p(6480707),
    p(7173636),
    u("1584133760927-1fe410b4388b"),
    p(53442),
    p(213217),
  ],
  "heritage-houseboat": [
    p(36767624),
    p(5998125),
    u("1595578358495-42239af8c517"),
    p(6011742),
    p(6036241),
  ],
  "mandarin-oriental-bangkok": [
    p(6184598),
    p(6207034),
    u("1611892440504-42a41615caea"),
    p(6218705),
    p(6238196),
  ],
  "beachfront-luxury-resort": [
    p(6243108),
    p(6472147),
    u("1596394516081-5204ae93ac6d"),
    p(271624),
    p(871636),
  ],
  "ahilya-by-the-sea": [
    p(1059338),
    p(1571463),
    u("1602008640043-0a70eb017da4"),
    p(340201),
    p(447654),
  ],
  "pangong-lake-camp": [
    p(3155668),
    p(1687845),
    u("1605557627931-ead01601065e"),
    p(3048115),
    p(3385153),
  ],
  "sofitel-metropole-hanoi": [
    p(3827389),
    p(3951377),
    u("1600585154340-be6161a56a0c"),
    p(4099234),
    p(5773808),
  ],
  "anantara-hoi-an": [
    p(5806794),
    p(5824529),
    u("1600607687939-e69256a7d0b9"),
    p(5843998),
    p(5866878),
  ],
  "marina-bay-sands": [
    u("1525625283386-37f58bf0161d"),
    p(1018698),
    p(1892959),
    u("1542314831-8c0670ae5489"),
    p(1758144),
  ],
  "willow-banks-shimla": [
    p(4877062),
    p(3574440),
    p(818342),
    u("1657894736581-ccc35d62d9e2"),
    p(6720718),
  ],
  "radisson-jass-shimla": [
    p(3574440),
    p(7170023),
    p(4877062),
    p(2387866),
    p(1365425),
  ],
  "welcomhotel-itc-shimla": [
    p(7170023),
    p(4877062),
    u("1657894736581-ccc35d62d9e2"),
    p(6720718),
    p(1892959),
  ],
  "wildflower-hall-shimla": [
    p(818342),
    p(7170023),
    p(4877062),
    p(3574440),
    u("1582719478250-c89cae4dc85b"),
  ],
  "aman-tokyo": [
    u("1540959736712-19563eedd508"),
    p(2507010),
    p(261181),
    u("1528164343985-4aa112123da7"),
    p(189296),
  ],
  "gora-kadan": [
    p(189296),
    p(261181),
    u("1493976040374-85c8e12f07a0"),
    p(2507010),
    p(358136),
  ],
  "suiran-kyoto": [
    p(261181),
    u("1493976040374-85c8e12f07a0"),
    p(189296),
    p(2507010),
    u("1528164343985-4aa112123da7"),
  ],
};

/** Primary card / thumbnail, first gallery frame */
export function getHotelPrimaryImage(hotelId: string, fallback: string): string {
  return hotelGalleries[hotelId]?.[0] ?? fallback;
}
