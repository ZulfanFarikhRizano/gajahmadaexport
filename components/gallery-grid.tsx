"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, type Product } from "@/lib/types";

interface GalleryGridProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 12;

// --- UTILITIES ---
const cleanStr = (str?: string) =>
  (str || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

const getProductCategorySlug = (product: Product): string => {
  if (!product) return "chair-indoor";

  const rawCat = cleanStr(product.category);
  const prodId = cleanStr(product.id);

  if (/^li/i.test(prodId)) return "lounge-indoor";
  if (/^co/i.test(prodId)) return "outdoor-chair";
  if (/^ld/i.test(prodId)) return "lounge-daybed";
  if (/^ch/i.test(prodId)) return "chair-indoor";
  if (/^bc/i.test(prodId)) return "bistro-chair";
  if (/^bw/i.test(prodId)) return "basket-ware";
  if (/^acc/i.test(prodId)) return "accessories";
  if (/^tbi/i.test(prodId)) return "table-indoor";

  const matchedCategory = CATEGORIES.find(
    (c) => cleanStr(c.slug) === rawCat || cleanStr(c.label) === rawCat
  );
  if (matchedCategory) return matchedCategory.slug;

  if (rawCat.includes("loungeindoor") || rawCat === "lounge") return "lounge-indoor";
  if (rawCat.includes("loungedaybed") || rawCat.includes("daybed")) return "lounge-daybed";
  if (rawCat.includes("outdoor")) return "outdoor-chair";
  if (rawCat.includes("bistro")) return "bistro-chair";
  if (rawCat.includes("basket")) return "basket-ware";
  if (rawCat.includes("accessori") || rawCat.includes("accesori")) return "accessories";
  if (rawCat.includes("table")) return "table-indoor";

  return "chair-indoor";
};

const getSafeImageUrl = (images?: string[]): string => {
  if (
    Array.isArray(images) &&
    images.length > 0 &&
    typeof images[0] === "string" &&
    images[0].trim() !== ""
  ) {
    return images[0];
  }
  return "/placeholder.jpg";
};

export function GalleryGrid({ products = [] }: GalleryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gridTopRef = React.useRef<HTMLDivElement>(null);

  // Sync state langsung dengan URL params
  const selectedCategory = searchParams.get("category") || "all";
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1));

  // Filter & Deduplikasi Produk
  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    const uniqueMap = new Map<string, Product>();
    products.forEach((item) => {
      if (!item) return;
      const codeKey = cleanStr(item.id);
      if (codeKey && !uniqueMap.has(codeKey)) {
        uniqueMap.set(codeKey, item);
      }
    });

    const uniqueProducts = Array.from(uniqueMap.values());
    if (selectedCategory === "all") return uniqueProducts;

    const targetSlug = cleanStr(selectedCategory);
    return uniqueProducts.filter((product) => {
      const prodSlug = cleanStr(getProductCategorySlug(product));
      return (
        prodSlug === targetSlug ||
        cleanStr(product.category) === targetSlug
      );
    });
  }, [products, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  // Fungsi update URL
  const updateQueryParams = (newCategory: string, newPage: number, shouldScroll: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", newCategory);
    params.set("page", newPage.toString());

    router.push(`?${params.toString()}`, { scroll: false });

    if (shouldScroll) {
      if (gridTopRef.current) {
        gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    updateQueryParams(categorySlug, 1, false);
  };

  const handlePageChange = (newPage: number, shouldScroll: boolean = false) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateQueryParams(selectedCategory, newPage, shouldScroll);
  };

  const paginatedProducts = React.useMemo(() => {
    if (filteredProducts.length === 0) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div ref={gridTopRef} className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 scroll-mt-28">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleCategoryChange("all")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border ${
            selectedCategory === "all"
              ? "bg-[#2d211a] text-white border-[#2d211a] shadow-sm"
              : "bg-white text-clay-700 border-clay-300 hover:bg-clay-100 shadow-sm"
          }`}
        >
          Semua Kategori
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border ${
              selectedCategory === cat.slug
                ? "bg-[#b3593b] text-white border-[#b3593b] shadow-sm"
                : "bg-white text-clay-700 border-clay-300 hover:bg-clay-100 shadow-sm"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Counter Info */}
      <div className="w-full text-center my-3 py-1">
        <p className="text-xs text-clay-600 font-medium tracking-wide">
          Menampilkan <span className="font-semibold text-clay-900">{filteredProducts.length}</span> produk
        </p>
      </div>

      {/* Grid Content Area */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-clay-200 shadow-sm my-6">
          <p className="text-clay-600 font-medium">
            Belum ada produk untuk kategori ini.
          </p>
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className="mt-3 text-xs font-semibold text-[#b3593b] hover:underline"
          >
            Lihat semua produk
          </button>
        </div>
      ) : (
        <div className="relative w-full min-h-[450px]">
          
          {/* FLOATING BUTTONS */}
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-0.5 -mx-2 sm:-mx-4">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1, false)}
              disabled={currentPage === 1 || totalPages <= 1}
              aria-label="Previous Page"
              className={`pointer-events-auto flex items-center justify-center 
                w-8 h-8 sm:w-11 sm:h-11 rounded-full 
                bg-white/30 sm:bg-white/80 backdrop-blur-sm border border-white/40 sm:border-clay-200 
                text-clay-900 shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-150 ${
                  currentPage === 1 || totalPages <= 1
                    ? "opacity-0 pointer-events-none scale-75"
                    : "opacity-100 scale-100"
                }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-clay-900" />
            </button>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1, false)}
              disabled={currentPage === totalPages || totalPages <= 1}
              aria-label="Next Page"
              className={`pointer-events-auto flex items-center justify-center 
                w-8 h-8 sm:w-11 sm:h-11 rounded-full 
                bg-white/30 sm:bg-white/80 backdrop-blur-sm border border-white/40 sm:border-clay-200 
                text-clay-900 shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-150 ${
                  currentPage === totalPages || totalPages <= 1
                    ? "opacity-0 pointer-events-none scale-75"
                    : "opacity-100 scale-100"
                }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-clay-900" />
            </button>
          </div>

          {/* Product Cards Grid dengan Efek Transition Key */}
          <div 
            key={`${selectedCategory}-page-${currentPage}`}
            className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
          >
            {paginatedProducts.map((product, idx) => {
              if (!product || !product.id) return null;

              const imageUrl = getSafeImageUrl(product.images);
              const categoryParam = getProductCategorySlug(product);
              const productName = product.name || "Unnamed Product";

              return (
                <Link
                  key={`${product.id}-p${currentPage}`}
                  href={`/product/${encodeURIComponent(categoryParam)}/${product.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg border border-clay-200 flex flex-col w-full"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-clay-100">
                    <Image
                      key={`${imageUrl}-p${currentPage}`}
                      src={imageUrl}
                      alt={productName}
                      fill
                      unoptimized={true}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm text-clay-950 line-clamp-2 group-hover:text-[#b3593b] transition-colors leading-snug">
                        {productName}
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

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 pb-12">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1, true)}
                disabled={currentPage === 1}
                className="rounded-xl border border-clay-300 bg-white px-4 py-2 text-xs font-semibold text-clay-700 shadow-sm hover:bg-clay-50 disabled:opacity-40 transition-colors"
              >
                Prev
              </button>
              <span className="text-xs font-mono font-medium text-clay-600 px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1, true)}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-clay-300 bg-white px-4 py-2 text-xs font-semibold text-clay-700 shadow-sm hover:bg-clay-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}