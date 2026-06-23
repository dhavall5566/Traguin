export type GalleryCategory = {
  id: string;
  label: string;
};

export type GalleryItem = {
  id: string;
  place: string;
  region: string;
  image: string;
  alt: string;
  categorySlugs: string[];
  layout: string;
  labelStyle: string;
};

export type GalleryClientWallItem = {
  id: string;
  name: string;
  destination: string;
  tripType: string;
  image: string;
  rotate: number;
};

export type GalleryFilmMoment = {
  id: string;
  title: string;
  destination: string;
  caption: string;
  poster: string;
  src: string;
};

export function filterGalleryItems(items: GalleryItem[], categoryId: string): GalleryItem[] {
  if (categoryId === "all") return items;
  return items.filter((item) => item.categorySlugs.includes(categoryId));
}
