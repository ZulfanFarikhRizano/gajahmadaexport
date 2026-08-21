
import { getSiteContent } from "@/lib/data-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function AboutPage() {
  const siteContent = await getSiteContent();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-medium text-clay-950">About Us</h1>
      <p className="mt-6 leading-relaxed text-clay-800">{siteContent.aboutText}</p>
    </main>
  );
}
