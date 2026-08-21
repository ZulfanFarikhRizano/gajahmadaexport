import { getSiteContent } from "@/lib/data-store";
import { CtaAnimated } from "./cta-animated";

export async function CTA() {
  const siteContent = await getSiteContent();
  return <CtaAnimated waNumber={siteContent.whatsappNumber} />;
}
