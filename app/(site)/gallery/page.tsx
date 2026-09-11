import { getProducts } from "@/lib/data-store";
import { GalleryGrid } from "@/components/gallery-grid";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

// URL Base Supabase Storage (Bucket: uploads)
const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

function getValidImageUrl(img: any): string {
  if (!img || typeof img !== "string" || img.trim() === "") {
    return PLACEHOLDER_IMAGE;
  }
  
  let formattedImg = img.trim();
  
  // Apabila belum menggunakan .webp, ubah/tambahkan ekstensi .webp
  if (!formattedImg.endsWith(".webp")) {
    // Jika ada ekstensi lain (seperti .png/.jpg), ganti dengan .webp
    formattedImg = formattedImg.replace(/\.[^/.]+$/, "") + ".webp";
  }

  if (formattedImg.startsWith("http://") || formattedImg.startsWith("https://")) {
    return formattedImg;
  }
  
  const cleanFileName = formattedImg.startsWith("/") ? formattedImg.slice(1) : formattedImg;
  return `${SUPABASE_STORAGE_URL}/${cleanFileName}`;
}

export const revalidate = 60;

export default async function GalleryPage() {
  const rawProducts = await getProducts();

  const products = rawProducts.map((product) => {
    // Memperbaiki seluruh array gambar produk
    const validImages = Array.isArray(product.images)
      ? product.images.map((img) => getValidImageUrl(img))
      : [getValidImageUrl(product.images)];

    return {
      ...product,
      images: validImages,
    };
  });

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