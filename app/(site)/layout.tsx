
import { getSiteContent } from "@/lib/data-store";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsAppButton } from "@/components/whatsapp-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent();

  return (
    <>
      <Navbar siteName={siteContent.siteName} logoUrl={siteContent.logoUrl} />
      {children}
      <Footer siteName={siteContent.siteName} />
      <FloatingWhatsAppButton waNumber={siteContent.whatsappNumber} />
    </>
  );
}