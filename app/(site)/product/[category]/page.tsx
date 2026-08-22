import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByCategory, getSiteContent } from "@/lib/data-store";
import { CATEGORIES } from "@/lib/types";
import { ProductWhatsAppButton } from "@/components/whatsapp-button";
import { SafeImage } from "@/components/safe-image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = CATEGORIES.find((c) => c.slug === params.category);
  if (!category) notFound();

  const [products, siteContent] = await Promise.all([
    getProductsByCategory(category.slug),
    getSiteContent(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-medium text-clay-950">
        {category.label}
      </h1>
      <p className="mt-2 text-clay-600">
        {products.length} produk tersedia dalam kategori ini.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-clay-600">
          Belum ada produk di kategori ini. Tambahkan lewat dashboard admin.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.category}/${product.id}`}
              className="block overflow-hidden rounded-2xl border border-clay-950/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-cream-100">
                <SafeImage
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg text-clay-950">{product.name}</h2>
                <p className="mt-1 text-sm text-clay-600 line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-2 text-sm font-medium text-terracotta-600">
                  {product.price}
                </p>
                <div className="mt-4">
                  <ProductWhatsAppButton
                    waNumber={siteContent.whatsappNumber}
                    product={product}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}