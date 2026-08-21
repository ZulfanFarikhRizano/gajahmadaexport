import { getSiteContent } from "@/lib/data-store";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle, MapPin } from "lucide-react";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function ContactPage() {
  const siteContent = await getSiteContent();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-medium text-clay-950">Contact Us</h1>
      <p className="mt-4 flex items-center justify-center gap-2 text-clay-600">
        <MapPin size={18} />
        {siteContent.contactAddress}
      </p>

      <a
        href={buildGeneralWhatsAppLink(siteContent.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-medium text-white hover:bg-[#1ebe5b]"
      >
        <MessageCircle size={20} />
        Chat via WhatsApp
      </a>
    </main>
  );
}
