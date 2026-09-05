import { FileText } from "lucide-react";
import { ECatalogButton } from "./ecatalog-button"; // sesuaikan path ke file button kamu

interface PaymentInfoProps {
  catalogUrl?: string | null;
}

export function PaymentInfo({ catalogUrl }: PaymentInfoProps) {
  // Gunakan catalogUrl dari database, fallback ke '#' jika belum diunggah
  const pdfLink = catalogUrl || "#";

  return (
    <section className="bg-white py-12 px-6 border-t border-clay-950/10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">
          Digital Product Catalog
        </p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <FileText size={20} className="text-terracotta-600" />
          <span className="font-display text-lg text-clay-950">
            E-Catalog Available for Download
          </span>
        </div>
        <p className="text-sm text-clay-600 mb-6">
          Explore our complete collection of handcrafted furniture and high-quality rattan products. 
          Download our digital catalog to view full specifications, design variations, and ordering details.
        </p>

        {/* Render tombol E-Catalog */}
        <div className="flex justify-center">
          <ECatalogButton href={pdfLink} />
        </div>
      </div>
    </section>
  );
}