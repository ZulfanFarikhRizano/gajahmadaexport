import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById, getSiteContent } from "@/lib/data-store";
import { CATEGORIES } from "@/lib/types";
import { SafeImage } from "@/components/safe-image";
import { ProductWhatsAppButton } from "@/components/whatsapp-button";
import { AddToQuoteButton } from "@/components/add-to-quote-button";

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
  const images = product.images.length > 0 ? product.images : [undefined];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href={`/product/${product.category}`}
        className="inline-flex items-center gap-1.5 text-sm text-clay-600 hover:text-terracotta-600 mb-8"
      >
        <ArrowLeft size={16} />
        Kembali ke {category?.label ?? "kategori"}
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream-100">
            <SafeImage
              src={images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-cream-100">
                  <SafeImage src={img} alt={`${product.name} ${i + 2}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {category && (
            <p className="text-xs tracking-[0.2em] uppercase text-brass-500 mb-2">
              {category.label}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-medium text-clay-950">
            {product.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-terracotta-600">{product.price}</p>

          <p className="mt-6 leading-relaxed text-clay-800 whitespace-pre-line">
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