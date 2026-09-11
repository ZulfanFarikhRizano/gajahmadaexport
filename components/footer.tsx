import Link from "next/link";
import { Mail, MapPin, Globe } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export function Footer({ siteName, tagline }: { siteName: string; tagline: string }) {
  return (
    <footer 
      className="relative w-full text-clay-800 pt-14 pb-28 sm:pb-16 border-t border-clay-200 overflow-hidden bg-white bg-repeat bg-[length:240px_240px]"
      style={{ backgroundImage: `url('/images/batik-pattern.png')` }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Kolom Profil Brand & Kontak Eksportir */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <p className="font-serif text-2xl font-bold text-clay-950 tracking-tight">{siteName}</p>
              <p className="mt-1 text-xs text-clay-600 leading-relaxed max-w-md">{tagline}</p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-clay-700">
                <MapPin size={14} className="text-[#b3593b] shrink-0" />
                <span>Cirebon, West Java, Indonesia (Origin)</span>
              </div>
              <div>
                <a
                  href="mailto:Inquiry@gajahmadaexport.com"
                  className="inline-flex items-center gap-2 text-xs font-medium text-clay-800 hover:text-[#b3593b] transition-colors"
                >
                  <Mail size={14} className="text-[#b3593b] shrink-0" />
                  Inquiry@gajahmadaexport.com
                </a>
              </div>
            </div>

            {/* Badges Sertifikasi & Pembayaran */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Certifications */}
              <div>
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#b3593b] block mb-2">
                  Certifications
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 items-center justify-center rounded-lg bg-white/90 border border-clay-200/80 p-1.5 shadow-sm backdrop-blur-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/legal-wood.png"
                      alt="SVLK Indonesian Legal Wood Certification"
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex h-9 items-center justify-center rounded-lg bg-white/90 border border-clay-200/80 p-1.5 shadow-sm backdrop-blur-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/amfori-bsci.png"
                      alt="Amfori BSCI Social Compliance Audit"
                      className="h-full w-auto object-contain rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#b3593b] block mb-2">
                  Accepted Payments
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="flex h-8 items-center justify-center rounded-md bg-white/90 border border-clay-200/80 px-2 py-1 shadow-sm backdrop-blur-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/paypal.png"
                      alt="PayPal Verified Merchant"
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex h-8 items-center justify-center rounded-md bg-white/90 border border-clay-200/80 px-2 py-1 shadow-sm backdrop-blur-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/mastercard.png"
                      alt="Mastercard Accepted"
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  <div className="flex h-8 items-center justify-center rounded-md bg-white/90 border border-clay-200/80 px-2 py-1 shadow-sm backdrop-blur-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/ocbc.png"
                      alt="OCBC Bank Telegraphic Transfer"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Kolom Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-clay-200">
            
            {/* Catalog Collections */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#b3593b] block mb-3">
                Collections
              </span>
              <ul className="space-y-2 text-xs font-medium text-clay-700">
                {CATEGORIES.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/product/${c.slug}`} className="hover:text-[#b3593b] transition-colors">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#b3593b] block mb-3">
                Company
              </span>
              <ul className="space-y-2 text-xs font-medium text-clay-700">
                <li><Link href="/about" className="hover:text-[#b3593b] transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-[#b3593b] transition-colors">Contact Us</Link></li>
                <li><Link href="/gallery" className="hover:text-[#b3593b] transition-colors">Gallery</Link></li>
                <li><Link href="/custom-order" className="hover:text-[#b3593b] transition-colors">Custom Order (B2B)</Link></li>
              </ul>
            </div>

            {/* Export Info */}
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#b3593b] block mb-3">
                Export Services
              </span>
              <ul className="space-y-1.5 text-xs text-clay-600">
                <li>FOB / CIF Shipping</li>
                <li>Worldwide Container Loading</li>
                <li>Custom OEM / ODM Design</li>
                <li>Sustainable Rattan Sourcing</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-clay-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-clay-500">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="flex items-center gap-1 text-clay-400">
            <Globe size={12} /> Worldwide Wholesale & Export Supplier
          </p>
        </div>

      </div>
    </footer>
  );
}