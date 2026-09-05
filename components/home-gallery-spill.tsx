"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { CoverflowCarousel, type CoverflowSlide } from "./coverflow-carousel";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

interface HomeGallerySpillProps {
  slides: CoverflowSlide[];
  hrefs: string[];
  headline: string;
  subheadline: string;
  waNumber: string;
}

export function HomeGallerySpill({
  slides,
  hrefs,
  headline,
  subheadline,
  waNumber,
}: HomeGallerySpillProps) {
  const router = useRouter();
  if (slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "420px 420px",
          backgroundRepeat: "repeat",
        }}
      />

      <CoverflowCarousel
        slides={slides}
        cardWidth="clamp(160px, 26vw, 300px)"
        cardAspect={3 / 4}
        cardClassName="aspect-[3/4] rounded-2xl"
        rotate={44}
        depth={0.6}
        label="Cuplikan galeri produk"
        onSlideActivate={(index) => {
          const href = hrefs[index];
          if (href) router.push(href);
        }}
      />

      <div className="relative mx-auto max-w-2xl px-6 text-center mt-6">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-clay-950">
          {headline} <span className="text-plum-600 font-light">|</span>
        </h1>
        <p className="mt-2 font-display italic text-lg text-terracotta-600">
          {subheadline}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-800"
          >
            Explore Catalog
            <ArrowUpRight size={16} />
          </Link>

          <a
            href={buildGeneralWhatsAppLink(waNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-clay-950/20 px-6 py-2.5 text-sm font-medium text-clay-800 hover:border-terracotta-600 hover:text-terracotta-600"
          >
            <MessageCircle size={16} />
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}