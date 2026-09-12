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

  const formattedImg = img.trim();

  // Jika sudah berupa URL utuh (http/https), langsung kembalikan tanpa maksa ekstensi .webp
  if (formattedImg.startsWith("http://") || formattedImg.startsWith("https://")) {
    return formattedImg;
  }

  const cleanFileName = formattedImg.startsWith("/") ? formattedImg.slice(1) : formattedImg;
  return `${SUPABASE_STORAGE_URL}/${cleanFileName}`;
}

export const revalidate = 60;

export default async function GalleryPage() {
  let rawProducts: any[] = [];

  // Proteksi error fetch agar server tidak crash saat query Supabase gagal
  try {
    const fetched = await getProducts().catch((err) => {
      console.error("Error fetching products in GalleryPage:", err);
      return [];
    });
    if (Array.isArray(fetched)) {
      rawProducts = fetched;
    }
  } catch (error) {
    console.error("Critical error in GalleryPage fetch:", error);
    rawProducts = [];
  }

  // Formatting aman untuk produk & gambar
  const products = rawProducts.map((product) => {
    if (!product) return null;

    let imagesArray: any[] = [];

    // Parse aman untuk penanganan array maupun string JSON
    if (Array.isArray(product.images)) {
      imagesArray = product.images;
    } else if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images);
        imagesArray = Array.isArray(parsed) ? parsed : [product.images];
      } catch {
        imagesArray = [product.images];
      }
    }

    const validImages =
      imagesArray.length > 0
        ? imagesArray.map((img) => getValidImageUrl(img))
        : [PLACEHOLDER_IMAGE];

    return {
      ...product,
      images: validImages,
    };
  }).filter(Boolean); // Filter data null jika ada item produk yang corrupt

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