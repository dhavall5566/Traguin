<<<<<<< HEAD
/** Gallery-only 4K assets — not reused elsewhere on the site */
=======
/** Gallery-only 4K assets, not reused elsewhere on the site */
>>>>>>> dhaval
const pexels4k = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&fit=crop`;

export const galleryImages = {
  santorini: pexels4k(1010657),
  amalfi: pexels4k(2835562),
  maldives: pexels4k(1285626),
  kyoto: pexels4k(402028),
  patagonia: pexels4k(1179225),
  iceland: pexels4k(417074),
  marrakech: pexels4k(1029604),
  queenstown: pexels4k(1252869),
  serengeti: pexels4k(457881),
  norwayFjord: pexels4k(2166711),
  riviera: pexels4k(1963082),
  banff: pexels4k(2108845),
  mykonos: pexels4k(2901209),
  tuscany: pexels4k(2774556),
  azores: pexels4k(1619569),
  seychelles: pexels4k(1450363),
  petra: pexels4k(1343379),
  cinqueTerre: pexels4k(3155666),
} as const;
