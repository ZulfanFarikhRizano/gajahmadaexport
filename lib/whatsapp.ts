import type { Product } from "./types";
import type { QuoteItem } from "@/lib/quote-cart"; // <-- Ganti baris ini

export function buildProductWhatsAppLink(waNumber: string, product: Product) {
  const message = `Halo, saya tertarik dengan produk "${product.name}" (kode: ${product.id}). Apakah masih tersedia?`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppLink(waNumber: string) {
  const message = "Halo, saya ingin bertanya tentang produk Gajah Mada Export.";
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function buildInquiryWhatsAppLink(
  waNumber: string,
  input: { name: string; phone: string; categoryLabel: string; message?: string }
) {
  const lines = [
    `Halo, saya ingin memesan produk Gajah Mada Export.`,
    ``,
    `Nama: ${input.name}`,
    `No. WhatsApp: ${input.phone}`,
    `Kategori: ${input.categoryLabel}`,
  ];
  if (input.message?.trim()) lines.push(`Detail: ${input.message.trim()}`);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildQuoteWhatsAppLink(waNumber: string, items: QuoteItem[]) {
  const lines = [
    "Halo, saya ingin meminta penawaran (quote) untuk produk berikut:",
    "",
    ...items.map((i, idx) => `${idx + 1}. ${i.name} (${i.id}) — Qty: ${i.qty}`),
    "",
    "Mohon info harga & estimasi ongkir. Terima kasih.",
  ];
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}