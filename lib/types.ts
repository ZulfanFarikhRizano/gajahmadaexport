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
  { slug: "accessories", label: "Accessories", group: "other" }, // <-- Sudah diperbaiki dari "Accesoris" ke "Accessories"
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

// Tambahkan interface Testimonial ini
export interface Testimonial {
  id: string;
  testimonial: string;
  by: string;
  imgSrc: string;
}

export interface SiteContent {
  siteName: string;
  heroHeadline: string;
  heroSubheadline: string;
  whatsappNumber: string;
  contactAddress: string;
  aboutText: string;
  logoUrl: string;
  catalogUrl?: string;
  testimonials?: Testimonial[]; // Tambahkan field opsional ini
}