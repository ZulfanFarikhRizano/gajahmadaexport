import type { Product } from "./types";
import type { QuoteItem } from "@/lib/quote-cart";

/**
 * Normalizes phone numbers by stripping non-numeric characters.
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Helper untuk mengubah nama/slug kategori produk ke format URL yang valid
 */
function getCategorySlug(product: Product): string {
  if (!product.category) return "chair-indoor";
  const cat = product.category.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (cat.includes("loungeindoor")) return "lounge-indoor";
  if (cat.includes("loungedaybed") || cat.includes("daybed")) return "lounge-daybed";
  if (cat.includes("outdoor")) return "outdoor-chair";
  if (cat.includes("bistro")) return "bistro-chair";
  if (cat.includes("basket")) return "basket-ware";
  if (cat.includes("accessori") || cat.includes("accesori")) return "accessories";
  if (cat.includes("table")) return "table-indoor";

  return product.category.toLowerCase().replace(/\s+/g, "-");
}

export function buildProductWhatsAppLink(waNumber: string, product: Product) {
  const cleanNumber = cleanPhoneNumber(waNumber);
  const categorySlug = getCategorySlug(product);

  // Link URL halaman produk agar WhatsApp memuat preview gambar (OG Image)
  const productUrl = `https://gajahmadaexport.com/product/${categorySlug}/${product.id}`;

  const message = `Hello, I am interested in your product "${product.name}" (SKU/ID: ${product.id}). Could you please provide information regarding wholesale pricing and availability?\n\nProduct Link: ${productUrl}`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppLink(waNumber: string) {
  const cleanNumber = cleanPhoneNumber(waNumber);
  const message =
    "Hello, I would like to inquire about B2B wholesale cooperation and your product catalog for Gajah Mada Export.";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildInquiryWhatsAppLink(
  waNumber: string,
  input: { name: string; email: string; categoryLabel: string; message?: string }
) {
  const cleanNumber = cleanPhoneNumber(waNumber);
  const lines = [
    `Hello, I would like to make an inquiry regarding Gajah Mada Export products.`,
    ``,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject/Category: ${input.categoryLabel}`,
  ];
  if (input.message?.trim()) lines.push(`Message: ${input.message.trim()}`);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildQuoteWhatsAppLink(waNumber: string, items: QuoteItem[]) {
  const cleanNumber = cleanPhoneNumber(waNumber);
  const lines = [
    "Hello, I would like to request a wholesale price quotation for the following items:",
    "",
    ...items.map((i, idx) => `${idx + 1}. ${i.name} (SKU/ID: ${i.id})`),
    "",
    "Please share the details regarding item availability, Minimum Order Quantity (MOQ), and wholesale pricing. Thank you.",
  ];
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}