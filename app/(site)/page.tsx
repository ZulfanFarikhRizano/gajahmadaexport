import { getProducts, getSiteContent } from "@/lib/data-store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Product } from "@/lib/types";
import { IntroVideoOverlay } from "@/components/intro-video-overlay";
import { HomeGallerySpill } from "@/components/home-gallery-spill";
import Features from "@/components/features";
import { TestimonialsSection } from "@/components/testimonials-section";
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
  let siteContent = {
    heroHeadline: "",
    heroSubheadline: "",
    whatsappNumber: "",
    catalogUrl: "#",
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

  const topProducts = products.slice(0,20);

  const slides = topProducts.map((p) => ({
    src: getValidImageUrl(p?.images),
    alt: p?.name || "Product Image",
  }));

  const hrefs = topProducts.map(
    (p) => `/product/${encodeURIComponent(p?.category || "chair-indoor")}/${p?.id}`
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