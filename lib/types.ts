export interface Category {
  slug: string;
  label: string;
}

export const CATEGORIES: Category[] = [
  { slug: "chair-bench", label: "Chair & Bench" },
  { slug: "footstool", label: "Footstool" },
  { slug: "hanging-chair", label: "Hanging Chair" },
  { slug: "shelving-storage", label: "Shelving & Storage" },
  { slug: "table-set", label: "Table Set" },
  { slug: "barcart-buffet", label: "Barcart & Buffet" },
  { slug: "bed-bedhead", label: "Bed & Bedhead" },
  { slug: "daybed", label: "Daybed" },
  { slug: "mirror-wall-art", label: "Mirror & Wall Art" },
];

export interface Product {
  id: string;
  name: string;
  category: string; // Category slug
  description: string;
  price?: string; // free text, e.g. "Hubungi kami" or "Rp 3.500.000"
  images: string[]; // paths under /uploads or /images
  createdAt: string;
}

export interface SiteContent {
  siteName: string;
  logoUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  whatsappNumber: string; // digits only, international format e.g. 6285714365948
  aboutText: string;
  contactAddress: string;
}
