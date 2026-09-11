"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, type Product } from "@/lib/types";

interface GalleryGridProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

// Mapping prefix ID / SKU ke slug yang persis ada di CATEGORIES types.ts
const SKU_PREFIX_MAP: Record<string, string> = {
  "tbi-": "table-indoor",
  "bc-": "bistro-chair",
  "co-": "outdoor-chair",
  "li-": "lounge-indoor",
  "ch-": "chair-indoor",
  "ld-": "lounge-daybed",
  "bw-": "basket-ware",
  "acc-": "accessories",
};

export function GalleryGrid({ products }: GalleryGridProps) {
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  // Normalisasi string untuk matching aman
  const cleanStr = (str: string) =>
    (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  // Helper untuk deteksi slug kategori yang valid dari field category atau prefix ID produk
  const getProductCategorySlug = (product: Product): string => {
    const rawCat = cleanStr(product.category || "");

    // 1. Cek kecocokan langsung dari field category DB
    const matchedCategory = CATEGORIES.find(
      (c) => cleanStr(c.slug) === rawCat || cleanStr(c.label) === rawCat
    );
    if (matchedCategory) return matchedCategory.slug;

    // 2. Cek kecocokan dari Prefix SKU ID produk (misal: li-001 -> lounge-indoor)
    const idLower = (product.id || "").toLowerCase();
    for (const [prefix, slug] of Object.entries(SKU_PREFIX_MAP)) {
      if (idLower.startsWith(prefix)) {
        return slug;
      }
    }

    return "other";
  };

  // Reset pagination & trigger animasi saat filter berubah
  React.useEffect(() => {
    setCurrentPage(1);
    triggerAnimation();
  }, [selectedGroup, selectedCategory]);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePageChange = (newPage: number) => {
    triggerAnimation();
    setCurrentPage(newPage);
    // Smooth scroll back to top of grid
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const availableCategories = React.useMemo(() => {
    if (selectedGroup === "all") return CATEGORIES;
    return CATEGORIES.filter((c) => c.group === selectedGroup);
  }, [selectedGroup]);

  // Handler saat sub-kategori diklik: otomatis update group agar tidak kontradiksi
  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    if (slug !== "all") {
      const catDef = CATEGORIES.find((c) => c.slug === slug);
      if (catDef) {
        setSelectedGroup(catDef.group);
      }
    }
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const prodSlug = getProductCategorySlug(product);

      // 1. Filter Sub-Kategori
      if (selectedCategory !== "all") {
        const targetSlug = cleanStr(selectedCategory);
        const isMatch =
          cleanStr(prodSlug) === targetSlug ||
          cleanStr(product.category || "") === targetSlug;

        if (!isMatch) return false;
      }

      // 2. Filter Group (Indoor / Outdoor / Other) jika kategori == "all"
      if (selectedGroup !== "all" && selectedCategory === "all") {
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
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[60vh]">
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
          onClick={() => handleSelectCategory("all")}
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
            onClick={() => handleSelectCategory(cat.slug)}
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

      {/* Grid Produk & Kosong State */}
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
          {/* Grid Produk dengan Transisi Smooth */}
          <div
            className={`grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full transition-all duration-300 ease-out ${
              isAnimating
                ? "opacity-0 translate-y-3 scale-[0.99]"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {paginatedProducts.map((product) => {
              const imageUrl =
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.jpg";

              const categoryParam = getProductCategorySlug(product);

              return (
                <Link
                  key={product.id}
                  href={`/product/${encodeURIComponent(categoryParam)}/${
                    product.id
                  }`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-clay-200 flex flex-col w-full"
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

          {/* Floating Pagination Buttons (Samping Kiri & Kanan) */}
          {totalPages > 1 && (
            <>
              {/* Floating Prev Button */}
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 backdrop-blur-md text-clay-800 shadow-lg border border-clay-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Floating Next Button */}
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 backdrop-blur-md text-clay-800 shadow-lg border border-clay-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Bottom Page Indicator Badge */}
              <div className="mt-8 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-clay-200 shadow-sm text-xs font-mono font-medium text-clay-700">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="hover:text-terracotta-600 disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="hover:text-terracotta-600 disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}