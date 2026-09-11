"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, type Product } from "@/lib/types";

interface GalleryGridProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

export function GalleryGrid({ products }: GalleryGridProps) {
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedGroup, selectedCategory]);

  const availableCategories = React.useMemo(() => {
    if (selectedGroup === "all") return CATEGORIES;
    return CATEGORIES.filter((c) => c.group === selectedGroup);
  }, [selectedGroup]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const rawCat = (product.category || "").toLowerCase().trim();
      const selectedSub = selectedCategory.toLowerCase().trim();

      if (selectedCategory !== "all") {
        const isSubMatch =
          rawCat === selectedSub ||
          rawCat.replace(/\s+/g, "-") === selectedSub ||
          rawCat.replace(/-/g, " ") === selectedSub;

        if (!isSubMatch) return false;
      }

      if (selectedGroup !== "all") {
        const matchingCatDef = CATEGORIES.find(
          (c) =>
            c.slug.toLowerCase() === rawCat ||
            c.label.toLowerCase() === rawCat ||
            c.slug.toLowerCase() === rawCat.replace(/\s+/g, "-")
        );

        if (matchingCatDef && matchingCatDef.group !== selectedGroup) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, selectedGroup]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Group Filter */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4">
        <button
          onClick={() => {
            setSelectedGroup("all");
            setSelectedCategory("all");
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
            selectedGroup === "all"
              ? "bg-clay-950 text-white"
              : "bg-white text-clay-700 hover:bg-clay-100 border border-clay-200"
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => {
            setSelectedGroup("indoor");
            setSelectedCategory("all");
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
            selectedGroup === "indoor"
              ? "bg-clay-950 text-white"
              : "bg-white text-clay-700 hover:bg-clay-100 border border-clay-200"
          }`}
        >
          Indoor Collection
        </button>
        <button
          onClick={() => {
            setSelectedGroup("outdoor");
            setSelectedCategory("all");
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
            selectedGroup === "outdoor"
              ? "bg-clay-950 text-white"
              : "bg-white text-clay-700 hover:bg-clay-100 border border-clay-200"
          }`}
        >
          Outdoor Collection
        </button>
        <button
          onClick={() => {
            setSelectedGroup("other");
            setSelectedCategory("all");
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
            selectedGroup === "other"
              ? "bg-clay-950 text-white"
              : "bg-white text-clay-700 hover:bg-clay-100 border border-clay-200"
          }`}
        >
          Accessories & Others
        </button>
      </div>

      {/* Sub Category Filter */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-xl px-3 py-1 text-[11px] sm:text-xs font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-terracotta-600 text-white"
              : "bg-clay-100 text-clay-700 hover:bg-clay-200"
          }`}
        >
          Semua Kategori
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-xl px-3 py-1 text-[11px] sm:text-xs font-medium transition-all ${
              selectedCategory === cat.slug
                ? "bg-terracotta-600 text-white"
                : "bg-clay-100 text-clay-700 hover:bg-clay-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-clay-500 mb-6 text-center">
        Menampilkan {filteredProducts.length} produk
      </p>

      {/* Grid Produk: 2 Kolom di Mobile */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white/50 p-12 text-center border border-clay-200">
          <p className="text-clay-600 font-medium">
            Belum ada produk untuk kategori ini.
          </p>
          <button
            onClick={() => {
              setSelectedGroup("all");
              setSelectedCategory("all");
            }}
            className="mt-3 text-xs text-terracotta-600 hover:underline"
          >
            Lihat semua produk
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full">
            {paginatedProducts.map((product) => {
              const imageUrl =
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.jpg";

              return (
                <Link
                  key={product.id}
                  href={`/gallery/${product.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-clay-950/5 flex flex-col w-full"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-clay-100">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm text-clay-950 line-clamp-2 group-hover:text-terracotta-600 transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-[11px] sm:text-xs text-clay-500 font-mono">
                        {product.price || "Contact us"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-clay-200 px-3 py-1.5 text-xs font-medium text-clay-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-clay-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-clay-200 px-3 py-1.5 text-xs font-medium text-clay-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}