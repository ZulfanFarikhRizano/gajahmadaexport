"use client";

import * as React from "react";
import Link from "next/link";
import { CATEGORIES, type Product } from "@/lib/types";

interface GalleryGridProps {
  products: Product[];
}

export function GalleryGrid({ products }: GalleryGridProps) {
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Filter daftar tombol sub-kategori berdasarkan group terpilih
  const availableCategories = React.useMemo(() => {
    if (selectedGroup === "all") return CATEGORIES;
    return CATEGORIES.filter((c) => c.group === selectedGroup);
  }, [selectedGroup]);

  // Logika Filter Produk
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      const rawCat = (product.category || "").toLowerCase().trim();
      const selectedSub = selectedCategory.toLowerCase().trim();

      // 1. Filter Sub-kategori (Tombol Bawah)
      if (selectedCategory !== "all") {
        const isSubMatch =
          rawCat === selectedSub ||
          rawCat.replace(/\s+/g, "-") === selectedSub ||
          rawCat.replace(/-/g, " ") === selectedSub;

        if (!isSubMatch) return false;
      }

      // 2. Filter Group (Tombol Atas: Indoor / Outdoor / Other)
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Group Filter (Indoor / Outdoor / Accessories & Others) */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={() => {
            setSelectedGroup("all");
            setSelectedCategory("all");
          }}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
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
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
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
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
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
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
            selectedGroup === "other"
              ? "bg-clay-950 text-white"
              : "bg-white text-clay-700 hover:bg-clay-100 border border-clay-200"
          }`}
        >
          Accessories & Others
        </button>
      </div>

      {/* Sub Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-xl px-4 py-1.5 text-xs font-medium transition-all ${
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
            className={`rounded-xl px-4 py-1.5 text-xs font-medium transition-all ${
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

      {/* Product Grid */}
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/gallery/${product.id}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-clay-950/5 flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-clay-100">
                <img
                  src={
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-medium text-clay-950 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-clay-500">
                    {product.price || "Contact us"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}