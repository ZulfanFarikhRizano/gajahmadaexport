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

export function GalleryGrid({ products = [] }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  // Helper pembersihan string aman
  const cleanStr = (str?: string) =>
    (str || "")
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();

  // Determinasi Kategori berdasarkan Prefix Kode / Field Category
  const getProductCategorySlug = (product: Product): string => {
    if (!product) return "chair-indoor";

    const rawCat = cleanStr(product.category);
    const prodId = cleanStr(product.id);

    const matchedCategory = CATEGORIES.find(
      (c) => cleanStr(c.slug) === rawCat || cleanStr(c.label) === rawCat
    );
    if (matchedCategory) return matchedCategory.slug;

    if (/^li[-_]?/i.test(prodId)) return "lounge-indoor";
    if (/^co[-_]?/i.test(prodId)) return "outdoor-chair";
    if (/^ld[-_]?/i.test(prodId)) return "lounge-daybed";
    if (/^ch[-_]?/i.test(prodId)) return "chair-indoor";
    if (/^bc[-_]?/i.test(prodId)) return "bistro-chair";
    if (/^bw[-_]?/i.test(prodId)) return "basket-ware";
    if (/^acc[-_]?/i.test(prodId)) return "accessories";
    if (/^tbi[-_]?/i.test(prodId)) return "table-indoor";

    return "chair-indoor";
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  React.useEffect(() => {
    setCurrentPage(1);
    triggerAnimation();
  }, [selectedCategory]);

  const handlePageChange = (newPage: number) => {
    triggerAnimation();
    setCurrentPage(newPage);
  };

  // Filtering & Deduplikasi berdasarkan Kode Unik (product.id)
  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    const uniqueMap = new Map<string, Product>();

    products.forEach((item) => {
      if (!item) return;

      // Ambil kode unik produk (misal: "acc-001")
      const codeKey = cleanStr(item.id);

      // Hanya masukkan jika kode valid & belum ada di Map
      if (codeKey && !uniqueMap.has(codeKey)) {
        uniqueMap.set(codeKey, item);
      }
    });

    const uniqueProducts = Array.from(uniqueMap.values());

    if (selectedCategory === "all") return uniqueProducts;

    const targetSlug = cleanStr(selectedCategory);

    return uniqueProducts.filter((product) => {
      const prodSlug = getProductCategorySlug(product);
      return (
        cleanStr(prodSlug) === targetSlug ||
        cleanStr(product.category) === targetSlug
      );
    });
  }, [products, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = React.useMemo(() => {
    if (filteredProducts.length === 0) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Safe Image Helper (mencegah error/blank di mobile)
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

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
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
            onClick={() => setSelectedCategory(cat.slug)}
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

      <p className="text-xs text-clay-500 mb-6 text-center font-medium">
        Menampilkan {filteredProducts.length} produk
      </p>

      {/* Grid Container */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center border border-clay-200 shadow-sm">
          <p className="text-clay-600 font-medium">
            Belum ada produk untuk kategori ini.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="mt-3 text-xs font-semibold text-[#b3593b] hover:underline"
          >
            Lihat semua produk
          </button>
        </div>
      ) : (
        <div className="relative min-h-[400px]">
          {/* Floating Prev Button */}
          {totalPages > 1 && currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous Page"
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-clay-800 shadow-md border border-clay-200 hover:bg-clay-50 active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Floating Next Button */}
          {totalPages > 1 && currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next Page"
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-clay-800 shadow-md border border-clay-200 hover:bg-clay-50 active:scale-95 transition-transform"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Grid Products */}
          <div
            className={`grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full transition-all duration-200 ease-out ${
              isAnimating
                ? "opacity-40 translate-y-1 scale-[0.99]"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {paginatedProducts.map((product, idx) => {
              if (!product || !product.id) return null;

              const imageUrl = getSafeImageUrl(product.images);
              const categoryParam = getProductCategorySlug(product);
              const productName = product.name || "Unnamed Product";

              return (
                <Link
                  key={product.id || `prod-${idx}`}
                  href={`/product/${encodeURIComponent(categoryParam)}/${
                    product.id
                  }`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-clay-200 flex flex-col w-full"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-clay-100">
                    <Image
                      src={imageUrl}
                      alt={productName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      unoptimized={imageUrl.startsWith("http")}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-clay-300 bg-white px-3 py-1.5 text-xs font-semibold text-clay-700 shadow-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-mono font-medium text-clay-600 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-clay-300 bg-white px-3 py-1.5 text-xs font-semibold text-clay-700 shadow-sm disabled:opacity-40"
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