import { getSiteContent } from "@/lib/data-store";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { MapPin, Mail, MessageCircle, Phone, Send } from "lucide-react";

export const revalidate = 0;

export default async function ContactPage() {
  const siteContent = await getSiteContent();

  const emailTarget = "inquiry@gajahmadaexport.com";
  const whatsappNumber = siteContent.whatsappNumber || "628212334275";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        
        {/* KOLOM KIRI: Get in Touch & Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-clay-950 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-2 text-sm text-clay-600">
              Lets Talk with our Team
            </p>
          </div>

          <div className="space-y-6 text-sm text-clay-800">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">Address</p>
                <p className="mt-0.5 text-clay-600 leading-relaxed">
                  {siteContent.contactAddress}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">Email</p>
                <a
                  href={`mailto:${emailTarget}`}
                  className="mt-0.5 block text-clay-600 hover:text-terracotta-600 transition-colors"
                >
                  {emailTarget}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">WhatsApp</p>
                <a
                  href={buildGeneralWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-clay-600 hover:text-terracotta-600 transition-colors"
                >
                  {whatsappNumber}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">Phone</p>
                <a
                  href={`tel:${whatsappNumber}`}
                  className="mt-0.5 block text-clay-600 hover:text-terracotta-600 transition-colors"
                >
                  {whatsappNumber}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Form Send us a message */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-clay-900/5 border border-clay-100/80">
            <h2 className="font-display text-2xl font-medium text-clay-950 mb-6">
              Send us a message
            </h2>

            <form
              action={`mailto:${emailTarget}`}
              method="get"
              encType="text/plain"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <textarea
                  name="body"
                  rows={4}
                  placeholder="How can we help you?"
                  required
                  className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-terracotta-700 active:scale-[0.99] transition-all"
              >
                SEND MESSAGE
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}