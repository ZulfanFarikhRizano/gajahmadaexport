import type { Product } from "./types";
import type { QuoteItem } from "@/lib/quote-cart";

export function buildProductWhatsAppLink(waNumber: string, product: Product) {
  const cleanNumber = waNumber.replace(/[^0-9]/g, "");
  const message = `Halo, saya tertarik dengan produk "${product.name}" (SKU/ID: ${product.id}). Mohon informasi penawaran grosir dan ketersediaan stoknya.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppLink(waNumber: string) {
  const cleanNumber = waNumber.replace(/[^0-9]/g, "");
  const message = "Halo, saya ingin bertanya mengenai kerjasama wholesale/katalog produk Gajah Mada Export.";
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildInquiryWhatsAppLink(
  waNumber: string,
  input: { name: string; email: string; categoryLabel: string; message?: string }
) {
  const cleanNumber = waNumber.replace(/[^0-9]/g, "");
  const lines = [
    `Halo, saya ingin mengajukan pertanyaan seputar produk Gajah Mada Export.`,
    ``,
    `Nama: ${input.name}`,
    `Email: ${input.email}`,
    `Subject/Kategori: ${input.categoryLabel}`,
  ];
  if (input.message?.trim()) lines.push(`Pesan: ${input.message.trim()}`);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildQuoteWhatsAppLink(waNumber: string, items: QuoteItem[]) {
  const cleanNumber = waNumber.replace(/[^0-9]/g, "");
  const lines = [
    "Halo, saya ingin meminta penawaran grosir (wholesale quote) untuk daftar produk berikut:",
    "",
    ...items.map((i, idx) => `${idx + 1}. ${i.name} (SKU/ID: ${i.id})`),
    "",
    "Mohon informasi ketersediaan stok, Minimum Order Quantity (MOQ), dan skema harga grosirnya. Terima kasih.",
  ];
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}