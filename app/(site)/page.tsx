import { getProducts, getSiteContent } from "@/lib/data-store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Product } from "@/lib/types";
import { IntroVideoOverlay } from "@/components/intro-video-overlay";
import { HomeGallerySpill } from "@/components/home-gallery-spill";
import Features from "@/components/features";
import { TestimonialsSection } from "@/components/ui/stagger-testimonials";
import { CTA } from "@/components/cta";
import { PaymentInfo } from "@/components/payment-info";
import { PurchaseInquiryForm } from "@/components/purchase-inquiry-form";
import { ECatalogButton } from "@/components/ecatalog-button";

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

function getValidImageUrl(images: any): string {
  let rawUrl = "";

  if (Array.isArray(images) && images.length > 0) {
    rawUrl = images[0];
  } else if (typeof images === "string") {
    rawUrl = images;
  }

  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return PLACEHOLDER_IMAGE;
  }

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  const cleanFileName = rawUrl.startsWith("/") ? rawUrl.slice(1) : rawUrl;
  return `${SUPABASE_STORAGE_URL}/${cleanFileName}`;
}

export default async function HomePage() {
  let products: Product[] = [];
  let siteContent: Record<string, any> = {
    heroHeadline: "",
    heroSubheadline: "",
    whatsappNumber: "",
    catalogUrl: "#",
    featuredImages: [],
    testimonials: [],
  };

  try {
    const [fetchedProducts, fetchedContent] = await Promise.all([
      getProducts().catch((err) => {
        console.error("Error fetching products:", err);
        return [];
      }),
      getSiteContent().catch((err) => {
        console.error("Error fetching site content:", err);
        return {};
      }),
    ]);

    if (Array.isArray(fetchedProducts)) products = fetchedProducts;
    if (fetchedContent) siteContent = { ...siteContent, ...fetchedContent };
  } catch (error) {
    console.error("Critical error in HomePage fetch:", error);
  }

  // LOGIK SLIDES GALERI HERO:
  // 1. Jika Admin sudah upload/set `featuredImages` di Supabase siteContent, pakai foto-foto itu.
  // 2. Jika `featuredImages` kosong, baru fallback pakai top 20 foto dari daftar produk.
  let slides: { src: string; alt: string }[] = [];
  let hrefs: string[] = [];

  if (Array.isArray(siteContent.featuredImages) && siteContent.featuredImages.length > 0) {
    slides = siteContent.featuredImages.map((imgUrl: string, idx: number) => ({
      src: getValidImageUrl(imgUrl),
      alt: `Featured Showcase ${idx + 1}`,
    }));
    // Jika dari featuredImages admin, arahkan link klik ke halaman katalog/bebas
    hrefs = siteContent.featuredImages.map(() => "/#catalog");
  } else {
    const topProducts = products.slice(0, 20);
    slides = topProducts.map((p) => ({
      src: getValidImageUrl(p?.images),
      alt: p?.name || "Product Image",
    }));
    hrefs = topProducts.map(
      (p) => `/product/${encodeURIComponent(p?.category || "chair-indoor")}/${p?.id}`
    );
  }

  const catalogPdfUrl = siteContent.catalogUrl || "#";

  return (
    <main>
      <IntroVideoOverlay
        srcLandscape="/video/intro-desktop.mp4"
        srcPortrait="/video/intro-mobile.mp4"
      />

      <HomeGallerySpill
        slides={slides}
        hrefs={hrefs}
        headline={siteContent.heroHeadline}
        subheadline={siteContent.heroSubheadline}
        waNumber={siteContent.whatsappNumber}
      />
      
      <Features />

      {/* Passing data testimoni dari Supabase siteContent (Otomatis Fallback ke Hardcode jika kosong) */}
      <TestimonialsSection items={siteContent.testimonials} />

      <CTA />

      <PaymentInfo />

      <div className="flex justify-center bg-white py-12">
        <ECatalogButton href={catalogPdfUrl} />
      </div>

      <PurchaseInquiryForm />
    </main>
  );
}