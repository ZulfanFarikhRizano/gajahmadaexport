import { IntroVideoOverlay } from "@/components/intro-video-overlay";
import { getProducts, getSiteContent } from "@/lib/data-store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { HomeGallerySpill } from "@/components/home-gallery-spill";
import Features from "@/components/features";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTA } from "@/components/cta";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [products, siteContent] = await Promise.all([getProducts(), getSiteContent()]);

  const slides = products.slice(0, 5).map((p) => ({
    src: p.images[0] ?? PLACEHOLDER_IMAGE,
    alt: p.name,
  }));

  const hrefs = products.slice(0, 5).map((p) => `/product/${p.category}/${p.id}`);

  return (
    <main>
      <IntroVideoOverlay 
        srcLandscape="/video/intro-desktop.mp4" 
        srcPortrait="/video/intro-mobile.mp4" 
        posterLandscape="/images/intro-poster-desktop.jpg" 
        posterPortrait="/images/intro-poster-mobile.jpg" 
      />
      <HomeGallerySpill
        slides={slides}
        hrefs={hrefs}
        headline={siteContent.heroHeadline}
        subheadline={siteContent.heroSubheadline}
      />
      <Features />
      <TestimonialsSection />
      <CTA />
    </main>
  );
}