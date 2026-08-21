import Link from "next/link";
import { getProducts } from "@/lib/data-store";
import { CATEGORIES } from "@/lib/types";
import { SafeImage } from "@/components/safe-image";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function GalleryPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-cream-50 pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-6 text-center pt-12 mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-medium text-clay-950">
          Galeri Produk
        </h1>
        <p className="mt-2 text-clay-600">
          Klik salah satu koleksi untuk melihat detail & memesan lewat WhatsApp.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-clay-600">
          Belum ada produk. Tambahkan lewat dashboard admin.
        </p>
      ) : (
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const category = CATEGORIES.find((c) => c.slug === product.category);
            return (
              <Link
                key={product.id}
                href={`/product/${product.category}`}
                className="group block"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-cream-100">
                  <SafeImage
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2.5 text-sm font-medium text-clay-950 line-clamp-1">
                  {product.name}
                </p>
                {category && (
                  <p className="text-xs text-clay-600">{category.label}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
