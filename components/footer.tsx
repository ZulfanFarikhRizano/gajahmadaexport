import Link from "next/link";
import { Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export function Footer({ siteName, tagline }: { siteName: string; tagline: string }) {
  return (
    <footer className="bg-clay-950 text-cream-100/70 py-12">
      <div className="mx-auto max-w-6xl px-6 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-cream-50">{siteName}</p>
          <p className="mt-2 text-sm">{tagline}</p>

          <a
            href="mailto:gajahmadaexport@gmail.com"
            className="mt-3 inline-flex items-center gap-1.5 text-sm hover:text-cream-50"
          >
            <Mail size={14} />
            gajahmadaexport@gmail.com
          </a>

          {/* Sertifikasi / Certifications */}
          <div className="mt-6">
            <p className="text-xs tracking-[0.2em] uppercase text-brass-400 mb-3">
              Certifications
            </p>
            <div className="flex items-center gap-3">
              {/* Indonesian Legal Wood (diberi background putih tipis agar kontras) */}
              <div className="flex h-10 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/legal-wood.png"
                  alt="Indonesian Legal Wood"
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Amfori BSCI */}
              <div className="flex h-10 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/amfori-bsci.png"
                  alt="Amfori BSCI"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brass-400 mb-3">Produk</p>
          <ul className="space-y-1.5 text-sm">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/product/${c.slug}`} className="hover:text-cream-50">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brass-400 mb-3">Perusahaan</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/about" className="hover:text-cream-50">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-cream-50">Contact Us</Link></li>
            <li><Link href="/gallery" className="hover:text-cream-50">Galeri</Link></li>
            <li><Link href="/custom-order" className="hover:text-cream-50">Custom Order</Link></li>
          </ul>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-cream-100/40">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </p>
    </footer>
  );
}