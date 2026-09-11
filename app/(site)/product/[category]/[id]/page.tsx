import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Tag } from "lucide-react";
import { getProductById, getSiteContent } from "@/lib/data-store";
import { CATEGORIES } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { ProductWhatsAppButton } from "@/components/whatsapp-button";
import { AddToQuoteButton } from "@/components/add-to-quote-button";

export const revalidate = 0;

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

function getValidImageUrl(img: any): string {
  if (!img || typeof img !== "string" || img.trim() === "") {
    return PLACEHOLDER_IMAGE;
  }
  
  let formattedImg = img.trim();
  
  if (!formattedImg.endsWith(".webp")) {
    formattedImg = formattedImg.replace(/\.[^/.]+$/, "") + ".webp";
  }

  if (formattedImg.startsWith("http://") || formattedImg.startsWith("https://")) {
    return formattedImg;
  }
  
  const cleanFileName = formattedImg.startsWith("/") ? formattedImg.slice(1) : formattedImg;
  return `${SUPABASE_STORAGE_URL}/${cleanFileName}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const rawCategoryParam = decodeURIComponent(params.category);

  const [product, siteContent] = await Promise.all([
    getProductById(params.id),
    getSiteContent(),
  ]);

  if (!product) notFound();

  const normalize = (str: string) => str.toLowerCase().replace(/[\s_]+/g, "-");

  if (normalize(rawCategoryParam) !== normalize(product.category)) {
    notFound();
  }

  const category = CATEGORIES.find(
    (c) =>
      normalize(c.slug) === normalize(product.category) ||
      normalize(c.label) === normalize(product.category)
  );

  const rawMainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : PLACEHOLDER_IMAGE;

  const mainImage = getValidImageUrl(rawMainImage);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-sm text-clay-600 hover:text-terracotta-600 mb-6 sm:mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali ke Gallery
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* GAMBAR UTAMA SINGLE */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100 shadow-sm w-full">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* DETAIL PRODUK */}
        <div>
          {category && (
            <p className="text-xs tracking-[0.2em] uppercase text-brass-500 mb-2 font-semibold">
              {category.label}
            </p>
          )}

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-clay-950">
            {product.name}
          </h1>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-clay-200/50 px-2.5 py-1 text-xs font-mono font-medium text-clay-700 tracking-wide">
              <Tag size={12} className="text-clay-500" />
              SKU: {product.id}
            </span>
          </div>

          <p className="mt-4 text-base sm:text-lg font-medium text-terracotta-600">
            {product.price || "Contact Us"}
          </p>

          <p className="mt-6 leading-relaxed text-clay-800 whitespace-pre-line text-sm md:text-base">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ProductWhatsAppButton
              waNumber={siteContent.whatsappNumber}
              product={product}
            />
            <AddToQuoteButton
              id={product.id}
              name={product.name}
              category={product.category}
            />
          </div>
        </div>
      </div>
    </main>
  );
}