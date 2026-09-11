"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, type Product } from "@/lib/types";

interface GalleryGridProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

// Mapping prefix ID / SKU ke slug yang persis ada di CATEGORIES types.ts kamu
const SKU_PREFIX_MAP: Record<string, string> = {
  "tbi-": "table-indoor",
  "bc-": "bistro-chair",
  "co-": "outdoor-chair",
  "li-": "lounge-indoor",
  "ch-": "chair-indoor",
};

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

  // Normalisasi string untuk matching aman (menghapus spasi/dash berlebih)
  const cleanStr = (str: string) =>
    (str || "").toLowerCase().replace(/[\s_]+/g, "-").trim();

  // Helper untuk deteksi slug kategori yang valid dari field category atau prefix ID produk
  const getProductCategorySlug = (product: Product): string => {
    const rawCat = cleanStr(product.category || "");
    
    // Cek apakah category dari DB langsung cocok dengan salah satu slug di CATEGORIES
    const matchedCategory = CATEGORIES.find(
      (c) => cleanStr(c.slug) === rawCat || cleanStr(c.label) === rawCat
    );
    if (matchedCategory) return matchedCategory.slug;

    // Jika tidak ada di DB, fallback ke pencocokan prefix SKU
    const idLower = (product.id || "").toLowerCase();
    for (const [prefix, slug] of Object.entries(SKU_PREFIX_MAP)) {
      if (idLower.startsWith(prefix)) {
        return slug;
      }
    }

    return "chair-indoor"; // Default fallback aman
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const prodSlug = getProductCategorySlug(product);

      // 1. Filter Sub-Kategori
      if (selectedCategory !== "all") {
        const targetSlug = cleanStr(selectedCategory);
        if (prodSlug !== targetSlug) return false;
      }

      // 2. Filter Group (Indoor / Outdoor / Other)
      if (selectedGroup !== "all") {
        const catDef = CATEGORIES.find((c) => c.slug === prodSlug);
        if (catDef && catDef.group !== selectedGroup) {
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
      {/* Group Filter Header (Pill Buttons) */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[
          { id: "all", label: "All Products" },
          { id: "indoor", label: "Indoor Collection" },
          { id: "outdoor", label: "Outdoor Collection" },
          { id: "other", label: "Accessories & Others" },
        ].map((group) => (
          <button
            key={group.id}
            onClick={() => {
              setSelectedGroup(group.id);
              setSelectedCategory("all");
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
              selectedGroup === group.id
                ? "bg-clay-950 text-white border-clay-950 shadow-md ring-2 ring-clay-950/20"
                : "bg-white text-clay-700 border-clay-300 hover:bg-clay-100 hover:border-clay-400 shadow-sm"
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Sub Category Filter (Card Buttons) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
            selectedCategory === "all"
              ? "bg-terracotta-600 text-white border-terracotta-600 shadow-sm"
              : "bg-white text-clay-700 border-clay-300 hover:bg-clay-100 hover:border-clay-400 shadow-sm"
          }`}
        >
          Semua Kategori
        </button>
        {availableCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
              selectedCategory === cat.slug
                ? "bg-terracotta-600 text-white border-terracotta-600 shadow-sm"
                : "bg-white text-clay-700 border-clay-300 hover:bg-clay-100 hover:border-clay-400 shadow-sm"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-clay-500 mb-6 text-center font-medium">
        Menampilkan {filteredProducts.length} produk
      </p>

      {/* Grid Produk: 2 Kolom di Mobile */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-clay-200 shadow-sm">
          <p className="text-clay-600 font-medium">
            Belum ada produk untuk kategori ini.
          </p>
          <button
            onClick={() => {
              setSelectedGroup("all");
              setSelectedCategory("all");
            }}
            className="mt-3 text-xs font-semibold text-terracotta-600 hover:underline"
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

              const categoryParam = getProductCategorySlug(product);

              return (
                <Link
                  key={product.id}
                  /* Mengarah ke /product/[category]/[id] sesuai struktur folder VS Code */
                  href={`/product/${encodeURIComponent(categoryParam)}/${
                    product.id
                  }`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-clay-200 flex flex-col w-full"
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
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
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
                className="rounded-lg border border-clay-300 bg-white px-3 py-1.5 text-xs font-semibold text-clay-700 shadow-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-medium text-clay-600 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-clay-300 bg-white px-3 py-1.5 text-xs font-semibold text-clay-700 shadow-sm disabled:opacity-40"
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