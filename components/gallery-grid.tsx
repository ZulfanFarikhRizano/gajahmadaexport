"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { SafeImage } from "@/components/safe-image";

interface GalleryGridProps {
  products: Product[];
}

export function GalleryGrid({ products }: GalleryGridProps) {
  const [selectedGroup, setSelectedGroup] = useState<"all" | "indoor" | "outdoor" | "other">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const availableCategories = useMemo(() => {
    if (selectedGroup === "all") return CATEGORIES;
    return CATEGORIES.filter((c) => c.group === selectedGroup);
  }, [selectedGroup]);

  const handleGroupChange = (group: "all" | "indoor" | "outdoor" | "other") => {
    setSelectedGroup(group);
    setSelectedCategory("all");
  };

  // Helper normalisasi string untuk pencocokan kategori
  const normalize = (str: string) => str.toLowerCase().replace(/[\s_]+/g, "-");

  // Map kategori dengan key yang sudah dinormalisasi
  const categoryMap = useMemo(() => {
    const map = new Map();
    CATEGORIES.forEach((c) => {
      map.set(normalize(c.slug), c);
      map.set(normalize(c.label), c);
    });
    return map;
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const normalizedProdCat = normalize(product.category || "");
      const matchedCategory = categoryMap.get(normalizedProdCat);

      // Match Main Group
      const matchesGroup =
        selectedGroup === "all" || matchedCategory?.group === selectedGroup;

      // Match Sub Category
      const matchesCategory =
        selectedCategory === "all" ||
        normalizedProdCat === normalize(selectedCategory) ||
        (matchedCategory && normalize(matchedCategory.slug) === normalize(selectedCategory));

      return matchesGroup && matchesCategory;
    });
  }, [products, selectedGroup, selectedCategory, categoryMap]);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* 1. Main Group Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        {[
          { id: "all", label: "All Products" },
          { id: "indoor", label: "Indoor Collection" },
          { id: "outdoor", label: "Outdoor Collection" },
          { id: "other", label: "Accessories & Others" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleGroupChange(tab.id as "all" | "indoor" | "outdoor" | "other")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              selectedGroup === tab.id
                ? "bg-clay-950 text-white shadow-md"
                : "bg-white border border-clay-950/15 text-clay-800 hover:border-clay-950/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Dynamic Sub-Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 border-b border-clay-200/60 pb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-terracotta-600 text-white shadow-sm"
              : "bg-cream-100/80 text-clay-700 hover:bg-cream-200/80"
          }`}
        >
          Semua {selectedGroup === "all" ? "Kategori" : "Sub-Kategori"}
        </button>

        {availableCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === cat.slug
                ? "bg-terracotta-600 text-white shadow-sm"
                : "bg-cream-100/80 text-clay-700 hover:bg-cream-200/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Total Counter Indicator */}
      <div className="mb-6 flex items-center justify-between text-xs text-clay-600 px-1">
        <span>
          Menampilkan <strong className="text-clay-950">{filteredProducts.length}</strong> produk
        </span>
      </div>

      {/* 4. Grid List Catalog */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-cream-50/50 rounded-2xl border border-dashed border-clay-300">
          <p className="text-clay-600 font-medium">
            Belum ada produk untuk kategori ini.
          </p>
          <button
            onClick={() => {
              setSelectedGroup("all");
              setSelectedCategory("all");
            }}
            className="mt-3 text-xs text-terracotta-600 font-semibold hover:underline"
          >
            Lihat semua produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const category = categoryMap.get(normalize(product.category || ""));
            return (
              <Link
                key={product.id}
                href={`/product/${product.category}/${product.id}`}
                className="group block transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100 shadow-sm transition-shadow group-hover:shadow-lg">
                  <SafeImage
                    src={product.images && product.images.length > 0 ? product.images[0] : null}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-clay-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-medium text-cream-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                    Lihat Detail <ArrowUpRight size={13} />
                  </span>
                  {category && (
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-clay-800 backdrop-blur-sm z-10">
                      {category.label}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 text-sm font-medium text-clay-950 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                  {product.name}
                </p>
                {product.price && (
                  <p className="text-xs text-terracotta-600 font-medium">{product.price}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}