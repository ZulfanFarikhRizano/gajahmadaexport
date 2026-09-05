import { CreditCard } from "lucide-react";

export function PaymentInfo() {
  return (
    <section className="bg-white py-12 px-6 border-t border-clay-950/10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">
          Global Shipping & Secure Payments
        </p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <CreditCard size={20} className="text-terracotta-600" />
          <span className="font-display text-lg text-clay-950">PayPal available for international buyers</span>
        </div>
        <p className="text-sm text-clay-600">
          We cater to orders of all sizes — from a single hanging chair to full container loads.
          International buyers: PayPal & Wire Transfer. Domestic: Local bank transfer. Invoice &
          payment instructions are confirmed directly via WhatsApp once your order is received.
        </p>
      </div>
    </section>
  );
}