import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="bg-clay-950 text-cream-100/70 py-12">
      <div className="mx-auto max-w-6xl px-6 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-cream-50">{siteName}</p>
          <p className="mt-2 text-sm">Handwoven rattan, made to travel the world.</p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brass-400 mb-3">
            Produk
          </p>
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
          <p className="text-xs tracking-[0.2em] uppercase text-brass-400 mb-3">
            Perusahaan
          </p>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/about" className="hover:text-cream-50">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-cream-50">Contact Us</Link></li>
            <li><Link href="/gallery" className="hover:text-cream-50">Galeri</Link></li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-cream-100/40">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </p>
    </footer>
  );
}
