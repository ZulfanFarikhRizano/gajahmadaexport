import { FileText } from "lucide-react";

export function PaymentInfo() {
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
        <p className="text-sm text-clay-600">
          Explore our complete collection of handcrafted furniture and high-quality rattan products. 
          Download our digital catalog to view full specifications, design variations, and ordering details.
        </p>
      </div>
    </section>
  );
}