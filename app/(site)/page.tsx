import { getProducts, getSiteContent } from "@/lib/data-store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { HomeGallerySpill } from "@/components/home-gallery-spill";
import Features from "@/components/features";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTA } from "@/components/cta";
import { PaymentInfo } from "@/components/payment-info";
import { PurchaseInquiryForm } from "@/components/purchase-inquiry-form";
import { ECatalogButton } from "@/components/ecatalog-button";

export default async function HomePage() {
  const [products, siteContent] = await Promise.all([getProducts(), getSiteContent()]);

  const slides = products.slice(0, 5).map((p) => ({
    src: p.images[0] ?? PLACEHOLDER_IMAGE,
    alt: p.name,
  }));
  const hrefs = products.slice(0, 5).map((p) => `/product/${p.category}/${p.id}`);

  // URL PDF dinamis dari database (fallback ke '#' jika belum diisi)
  const catalogPdfUrl = siteContent.catalogUrl || "#";

  return (
    <main>
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
      
      {/* PaymentInfo dipanggil biasa tanpa prop catalogUrl */}
      <PaymentInfo />

      {/* Tombol ECatalogButton utama */}
      <div className="flex justify-center bg-white py-12">
        <ECatalogButton href={catalogPdfUrl} />
      </div>

      <PurchaseInquiryForm waNumber={siteContent.whatsappNumber} />
    </main>
  );
}