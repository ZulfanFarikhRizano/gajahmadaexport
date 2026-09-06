import { getProducts } from "@/lib/data-store";
import { GalleryGrid } from "@/components/gallery-grid";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

// Cache halaman selama 60 detik agar navigasi instant/cepat
export const revalidate = 60;

export default async function GalleryPage() {
  const rawProducts = await getProducts();

  const products = rawProducts.map((product) => ({
    ...product,
    images: product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE],
  }));

  return (
    <main className="min-h-screen bg-cream-50 pt-16 pb-24">
      <div className="mx-auto max-w-3xl px-6 text-center pt-12 mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-medium text-clay-950">
          Galeri Produk
        </h1>
        <p className="mt-2 text-clay-600">
          Klik salah satu koleksi untuk melihat detail & memesan lewat WhatsApp.
        </p>
      </div>

      <GalleryGrid products={products} />
    </main>
  );
}