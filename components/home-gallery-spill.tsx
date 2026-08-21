"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoverflowCarousel, type CoverflowSlide } from "./coverflow-carousel";

interface HomeGallerySpillProps {
  slides: CoverflowSlide[];
  headline: string;
  subheadline: string;
}

export function HomeGallerySpill({ slides, headline, subheadline }: HomeGallerySpillProps) {
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
        cardClassName="aspect-[3/4] rounded-2xl"
        cardAspect={3 / 4}
        rotate={44}
        depth={0.6}
        label="Cuplikan galeri produk"
      />

      <div className="relative mx-auto max-w-2xl px-6 text-center mt-6">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-clay-950">
          {headline} <span className="text-plum-600 font-light">|</span>
        </h1>
        <p className="mt-2 font-display italic text-lg text-terracotta-600">
          {subheadline}
        </p>
        <Link
          href="/gallery"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-clay-800 hover:text-terracotta-600"
        >
          Lihat Semua Galeri
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}