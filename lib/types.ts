export interface Category {
  slug: string;
  label: string;
  /** Untuk filter Indoor/Outdoor/Lainnya di halaman Galeri. */
  group: "indoor" | "outdoor" | "other";
}

export const CATEGORIES: Category[] = [
  { slug: "outdoor-chair", label: "Outdoor Chair", group: "outdoor" },
  { slug: "lounge-indoor", label: "Lounge Indoor", group: "indoor" },
  { slug: "lounge-daybed", label: "Lounge and Daybed", group: "outdoor" },
  { slug: "chair-indoor", label: "Chair Indoor", group: "indoor" },
  { slug: "bistro-chair", label: "Bistro Chair", group: "outdoor" },
  { slug: "basket-ware", label: "Basket Ware", group: "other" },
  { slug: "accessories", label: "Accesoris", group: "other" },
  { slug: "table-indoor", label: "Table Indoor", group: "indoor" },
];

export interface Product {
  id: string;
  name: string;
  category: string; // Category slug
  description: string;
  price?: string;
  images: string[];
  createdAt: string;
}

export interface SiteContent {
  siteName: string;
  logoUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  whatsappNumber: string;
  aboutText: string;
  contactAddress: string;
}