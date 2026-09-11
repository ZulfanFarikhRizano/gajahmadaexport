import { getSiteContent } from "@/lib/data-store";
import { CheckCircle2, Award, ShieldCheck, Globe2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const rawText = siteContent?.aboutText || "";

  // Split text berdasarkan baris/paragraf agar tetap dynamic dari manajemen
  const paragraphs = rawText
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  // Mengambil poin keunggulan B2B jika ada format list
  const highlights = [
    {
      title: "Uncompromising Quality",
      desc: "Direct partnership with local Cirebon artisans offering premium products at competitive price points.",
      icon: Award,
    },
    {
      title: "Agile Communication",
      desc: "Prompt, clear, and time-zone flexible communication for seamless global operations.",
      icon: Globe2,
    },
    {
      title: "End-to-End Service",
      desc: "Comprehensive support from initial sampling & custom specs to strict QC and port delivery.",
      icon: ShieldCheck,
    },
    {
      title: "Eco-Conscious Rattan",
      desc: "Sustainably sourced naturally renewable materials honoring rich heritage and environmental standards.",
      icon: Sparkles,
    },
  ];

  return (
    <main className="relative min-h-screen bg-clay-50/30 pb-20 pt-10">
      {/* Hero Header */}
      <section className="relative mx-auto max-w-5xl px-6 text-center">
        <span className="inline-block rounded-full bg-terracotta-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-terracotta-700">
          Heritage & Export Quality
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-clay-950 sm:text-5xl">
          Weaving Heritage into Global Living
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-clay-600 sm:text-base">
          Gajah Mada Export is a premier Indonesian exporter dedicated to delivering world-class rattan furniture to the global market.
        </p>
      </section>

      {/* Main Content Card */}
      <section className="mx-auto mt-12 max-w-4xl px-6">
        <div className="rounded-3xl border border-clay-200/80 bg-white p-8 shadow-sm sm:p-12">
          
          {/* Dynamic Content Rendering (Otomatis Memisah Paragraf) */}
          <div className="prose prose-clay max-w-none space-y-6 text-clay-700 leading-relaxed text-sm sm:text-base">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => {
                // Formatting khusus untuk sub-heading jika teks pendek atau berupa judul section
                const isHeading = paragraph.length < 50 && !paragraph.endsWith(".");
                
                if (isHeading) {
                  return (
                    <h2 key={index} className="pt-4 font-serif text-xl font-bold text-clay-950 sm:text-2xl">
                      {paragraph}
                    </h2>
                  );
                }

                return (
                  <p key={index} className="text-clay-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })
            ) : (
              <p className="italic text-clay-400">Content is being updated...</p>
            )}
          </div>

          {/* Highlights Grid */}
          <div className="mt-12 border-t border-clay-200 pt-10">
            <h3 className="font-serif text-lg font-bold text-clay-950">
              Our Core Competitive Advantages
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {highlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 rounded-2xl border border-clay-100 bg-clay-50/50 p-4">
                    <div className="rounded-xl bg-terracotta-50 p-2.5 text-terracotta-600 shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-clay-900">{item.title}</h4>
                      <p className="mt-1 text-xs text-clay-600 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action Footer */}
          <div className="mt-12 rounded-2xl bg-clay-900 p-6 text-center text-white sm:p-8">
            <h3 className="font-serif text-xl font-bold">Ready to Partner for Global Wholesale?</h3>
            <p className="mt-2 text-xs text-clay-300 sm:text-sm">
              Explore bespoke designs and container loading options tailored to your commercial needs.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/custom-order"
                className="rounded-full bg-terracotta-600 px-6 py-2.5 text-xs font-medium text-white transition hover:bg-terracotta-700"
              >
                Inquire Bespoke Order
              </a>
              <a
                href="/contact"
                className="rounded-full border border-clay-700 px-6 py-2.5 text-xs font-medium text-clay-200 hover:bg-clay-800"
              >
                Contact Export Team
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}