import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { getProductById, getSiteContent } from "@/lib/data-store";
import { CATEGORIES } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { SafeImage } from "@/components/safe-image";
import { ProductWhatsAppButton } from "@/components/whatsapp-button";
import { AddToQuoteButton } from "@/components/add-to-quote-button";

// MATIKAN CACHE DETAIL PRODUK
export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const [product, siteContent] = await Promise.all([
    getProductById(params.id),
    getSiteContent(),
  ]);

  if (!product || product.category !== params.category) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const images = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-sm text-clay-600 hover:text-terracotta-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Gallery
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        {/* GALERI GAMBAR */}
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream-100 shadow-sm">
            <SafeImage
              src={images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-cream-100 shadow-sm">
                  <SafeImage src={img} alt={`${product.name} ${i + 2}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DETAIL PRODUK */}
        <div>
          {category && (
            <p className="text-xs tracking-[0.2em] uppercase text-brass-500 mb-2 font-semibold">
              {category.label}
            </p>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-medium text-clay-950">
            {product.name}
          </h1>

          {/* BADGE / DISPLAY KODE PRODUK (SKU) */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-clay-200/50 px-2.5 py-1 text-xs font-mono font-medium text-clay-700 tracking-wide">
              <Tag size={12} className="text-clay-500" />
              SKU: {product.id}
            </span>
          </div>

          <p className="mt-4 text-lg font-medium text-terracotta-600">
            {product.price || "Contact Us"}
          </p>

          <p className="mt-6 leading-relaxed text-clay-800 whitespace-pre-line text-sm md:text-base">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ProductWhatsAppButton waNumber={siteContent.whatsappNumber} product={product} />
            <AddToQuoteButton id={product.id} name={product.name} category={product.category} />
          </div>
        </div>
      </div>
    </main>
  );
}