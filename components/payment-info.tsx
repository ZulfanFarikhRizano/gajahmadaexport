import { CreditCard } from "lucide-react";

export function PaymentInfo() {
  return (
    <section className="bg-white py-12 px-6 border-t border-clay-950/10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">Metode Pembayaran</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <CreditCard size={20} className="text-terracotta-600" />
          <span className="font-display text-lg text-clay-950">PayPal tersedia untuk pembeli internasional</span>
        </div>
        <p className="text-sm text-clay-600">
          Untuk pembayaran domestik kami menerima transfer bank, dan untuk buyer luar negeri kami
          menerima PayPal. Detail invoice & instruksi pembayaran dikonfirmasi langsung lewat WhatsApp
          setelah pesanan Anda kami terima, menyesuaikan jumlah, ongkir, dan negara tujuan.
        </p>
      </div>
    </section>
  );
}