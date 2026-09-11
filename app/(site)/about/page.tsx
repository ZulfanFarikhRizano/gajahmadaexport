import { getSiteContent } from "@/lib/data-store";
import { CheckCircle2, Globe2, ShieldCheck, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const rawText = siteContent?.aboutText || "";

  // Parser memisahkan baris teks dari manajemen
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Filter teks agar judul tidak terduplikasi di dalam kotak putih
  const filteredLines = lines.filter(
    (line) =>
      !line.toLowerCase().startsWith("gajah mada export: weaving heritage") &&
      !line.toLowerCase().startsWith("gajah mada export is a premier")
  );

  return (
    <main className="relative min-h-screen bg-clay-50/40 pb-24 pt-12">
      {/* Hero Header Page */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <span className="inline-block rounded-full bg-terracotta-100/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-terracotta-800">
          Heritage & Export Quality
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-clay-950 sm:text-5xl">
          Weaving Heritage into Global Living
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-clay-700 sm:text-base">
          Gajah Mada Export is a premier Indonesian exporter dedicated to delivering world-class rattan furniture to the global market.
        </p>
      </section>

      {/* Main Content Box */}
      <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-clay-200/80 bg-white p-6 shadow-sm sm:p-12">
          
          <div className="space-y-8">
            {filteredLines.map((line, index) => {
              // Deteksi Sub-heading (teks pendek tanpa titik di akhir)
              const isHeading = line.length < 60 && !line.endsWith(".");
              
              // Deteksi Poin List (diawali tanda strip '-' atau '•')
              const isListItem = line.startsWith("-") || line.startsWith("•");

              if (isHeading) {
                return (
                  <div key={index} className="pt-2">
                    <h2 className="font-serif text-xl font-bold tracking-tight text-clay-950 sm:text-2xl">
                      {line}
                    </h2>
                    <div className="mt-2 h-0.5 w-12 bg-[#b3593b]" />
                  </div>
                );
              }

              if (isListItem) {
                const cleanText = line.replace(/^[-•]\s*/, "");
                const [title, ...descParts] = cleanText.split(":");
                const description = descParts.join(":").trim();

                return (
                  <div key={index} className="flex items-start gap-3.5 rounded-2xl border border-clay-100 bg-clay-50/50 p-4 transition-colors hover:border-clay-200">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#b3593b]" />
                    <div className="text-xs sm:text-sm text-clay-800 leading-relaxed text-justify">
                      {description ? (
                        <>
                          <strong className="font-semibold text-clay-950">{title.trim()}: </strong>
                          {description}
                        </>
                      ) : (
                        cleanText
                      )}
                    </div>
                  </div>
                );
              }

              // Paragraf Biasa dengan Justify Alignment
              return (
                <p 
                  key={index} 
                  className="text-xs sm:text-sm leading-relaxed text-clay-800 text-justify sm:text-start"
                  style={{ textAlignLast: "left" }}
                >
                  {line}
                </p>
              );
            })}
          </div>

          {/* Core Values Badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-clay-100 pt-8 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-terracotta-50 p-2 text-[#b3593b]">
                <Globe2 size={18} />
              </div>
              <span className="text-xs font-semibold text-clay-900">Global Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-terracotta-50 p-2 text-[#b3593b]">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-semibold text-clay-900">Export Certified</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="rounded-xl bg-terracotta-50 p-2 text-[#b3593b]">
                <Sparkles size={18} />
              </div>
              <span className="text-xs font-semibold text-clay-900">Sustainable Rattan</span>
            </div>
          </div>

          {/* Call to Action Section (Tombol Sudah Kontras) */}
          <div className="mt-12 border-t border-clay-100 pt-8 text-center">
            <h3 className="font-serif text-lg font-bold text-clay-950">
              Interested in Wholesale Collaboration?
            </h3>
            <p className="mt-1 text-xs text-clay-600">
              Get in touch with our export team to request custom specifications and catalog.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/custom-order"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#b3593b] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#96482e]"
              >
                Inquire Bespoke Order
              </a>
              <a
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-clay-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-clay-800 shadow-sm transition-colors hover:bg-clay-50 hover:border-clay-400 hover:text-clay-950"
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