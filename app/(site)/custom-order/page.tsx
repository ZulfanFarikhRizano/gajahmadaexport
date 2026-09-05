import { getSiteContent } from "@/lib/data-store";
import { CustomOrderForm } from "@/components/custom-order-form";

export default async function CustomOrderPage() {
  const siteContent = await getSiteContent();

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-center text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">Bespoke</p>
      <h1 className="text-center font-display text-3xl font-medium text-clay-950 mb-2">Custom Order</h1>
      <p className="text-center text-sm text-clay-600 mb-8">
        Untuk desainer interior, pemilik hotel/vila, atau proyek dengan ukuran & motif khusus —
        ceritakan kebutuhan Anda, kami akan hubungi kembali dengan penawaran teknis.
      </p>
      <CustomOrderForm waNumber={siteContent.whatsappNumber} />
    </main>
  );
}