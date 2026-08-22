import { IntroVideoOverlay } from "@/components/intro-video-overlay";
import { getProducts, getSiteContent } from "@/lib/data-store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { HomeGallerySpill } from "@/components/home-gallery-spill";
import Features from "@/components/features";
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
        src="/video/intro.mp4" 
        poster="/images/intro-poster.jpg" 
      />
      <HomeGallerySpill
        slides={slides}
        hrefs={hrefs}
        headline={siteContent.heroHeadline}
        subheadline={siteContent.heroSubheadline}
      />
      <Features />
      <CTA />
    </main>
  );
}