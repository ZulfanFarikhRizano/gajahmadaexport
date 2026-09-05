"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { SafeImage } from "@/components/safe-image";

interface GalleryGridProps {
  products: Product[];
}

export function GalleryGrid({ products }: GalleryGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-clay-600">
        Belum ada produk. Tambahkan lewat dashboard admin.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const category = CATEGORIES.find((c) => c.slug === product.category);
        return (
          <Link
            key={product.id}
            href={`/product/${product.category}/${product.id}`}
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100 shadow-sm transition-shadow group-hover:shadow-lg">
              <SafeImage
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clay-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Lihat Detail <ArrowUpRight size={13} />
              </span>
              {category && (
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-clay-800 backdrop-blur-sm">
                  {category.label}
                </span>
              )}
            </div>
            <p className="mt-2.5 text-sm font-medium text-clay-950 line-clamp-1">
              {product.name}
            </p>
            <p className="text-xs text-terracotta-600">{product.price}</p>
          </Link>
        );
      })}
    </div>
  );
}