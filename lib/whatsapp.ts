import type { Product } from "./types";
import type { QuoteItem } from "@/lib/quote-cart";

/**
 * Normalizes phone numbers by stripping non-numeric characters.
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export function buildProductWhatsAppLink(waNumber: string, product: Product) {
  const cleanNumber = cleanPhoneNumber(waNumber);
  const message = `Hello, I am interested in your product "${product.name}" (SKU/ID: ${product.id}). Could you please provide information regarding wholesale pricing and availability?`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppLink(waNumber: string) {
  const cleanNumber = cleanPhoneNumber(waNumber);
  const message = "Hello, I would like to inquire about B2B wholesale cooperation and your product catalog for Gajah Mada Export.";
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