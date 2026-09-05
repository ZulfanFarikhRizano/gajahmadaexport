import { getSiteContent } from "@/lib/data-store";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsAppButton } from "@/components/whatsapp-button";
import { QuoteCartProvider } from "@/lib/quote-cart";
import { QuoteCartDrawer } from "@/components/quote-cart-drawer";
import { AnalyticsBeacon } from "@/components/analytics-beacon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent();

  return (
    <QuoteCartProvider>
      <Navbar siteName={siteContent.siteName} logoUrl={siteContent.logoUrl} />
      <AnalyticsBeacon />
      {children}
      <Footer siteName={siteContent.siteName} tagline={siteContent.heroSubheadline} />
      <FloatingWhatsAppButton waNumber={siteContent.whatsappNumber} />
      <QuoteCartDrawer waNumber={siteContent.whatsappNumber} />
    </QuoteCartProvider>
  );
}