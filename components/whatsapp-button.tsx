import { MessageCircle } from "lucide-react";
import { buildGeneralWhatsAppLink, buildProductWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export function FloatingWhatsAppButton({ waNumber }: { waNumber: string }) {
  return (
    <a
      href={buildGeneralWhatsAppLink(waNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition hover:scale-105"
    >
      <MessageCircle size={20} />
      <span className="hidden text-sm font-medium sm:inline">Chat via WhatsApp</span>
    </a>
  );
}

export function ProductWhatsAppButton({
  waNumber,
  product,
}: {
  waNumber: string;
  product: Product;
}) {
  return (
    <a
      href={buildProductWhatsAppLink(waNumber, product)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#1ebe5b]"
    >
      <MessageCircle size={16} />
      Beli via WhatsApp
    </a>
  );
}
