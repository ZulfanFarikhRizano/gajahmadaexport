import { Suspense } from "react";
import { getProducts, getSiteContent } from "@/lib/data-store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { IntroVideoOverlay } from "@/components/intro-video-overlay";
import { HomeGallerySpill } from "@/components/home-gallery-spill";
import Features from "@/components/features";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTA } from "@/components/cta";
import { PaymentInfo } from "@/components/payment-info";
import { PurchaseInquiryForm } from "@/components/purchase-inquiry-form";
import { ECatalogButton } from "@/components/ecatalog-button";
import { GalleryGrid } from "@/components/gallery-grid"; // Sesuaikan path jika dipanggil di sini

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
  const [products, siteContent] = await Promise.all([
    getProducts(),
    getSiteContent(),
  ]);

  const topProducts = products.slice(0, 5);

  const slides = topProducts.map((p) => ({
    src: getValidImageUrl(p.images),
    alt: p.name || "Product Image",
  }));

  const hrefs = topProducts.map(
    (p) => `/product/${p.category}/${p.id}`
  );

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

      {/* PASTI BUNGKUS DENGAN SUSPENSE AGAR CLIENT STATE / QUERY PARAMS LANGSUNG MEREFRESH DOM */}
      <Suspense fallback={<div className="py-12 text-center text-sm text-clay-600">Memuat produk...</div>}>
        <GalleryGrid products={products} />
      </Suspense>

      <Features />
      <TestimonialsSection />
      <CTA />

      <PaymentInfo />

      <div className="flex justify-center bg-white py-12">
        <ECatalogButton href={catalogPdfUrl} />
      </div>

      <PurchaseInquiryForm />
    </main>
  );
}