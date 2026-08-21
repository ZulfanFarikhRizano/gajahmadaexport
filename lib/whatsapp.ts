import type { Product } from "./types";

/**
 * Builds a wa.me link pre-filled with a message about a specific product.
 * `waNumber` must be digits only, international format (no +, no leading 0),
 * e.g. "6285714365948" for 0857-1436-5948.
 */
export function buildProductWhatsAppLink(waNumber: string, product: Product) {
  const message = `Halo, saya tertarik dengan produk "${product.name}" (kode: ${product.id}). Apakah masih tersedia?`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

/** Generic contact link, used for the floating WA button and Contact page. */
export function buildGeneralWhatsAppLink(waNumber: string) {
  const message = "Halo, saya ingin bertanya tentang produk Gajah Mada Export.";
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}
