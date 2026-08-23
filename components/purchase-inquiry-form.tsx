"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { buildInquiryWhatsAppLink } from "@/lib/whatsapp";

export function PurchaseInquiryForm({ waNumber }: { waNumber: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    setError(null);
    const categoryLabel = CATEGORIES.find((c) => c.slug === category)?.label ?? category;
    const link = buildInquiryWhatsAppLink(waNumber, { name, phone, categoryLabel, message });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="order" className="bg-cream-100 py-16 px-6">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-xs tracking-[0.3em] uppercase text-brass-500 mb-2">Pesan Sekarang</p>
        <h2 className="text-center font-display text-3xl font-medium text-clay-950 mb-2">Form Pemesanan</h2>
        <p className="text-center text-sm text-clay-600 mb-8">
          Isi detail di bawah — pesanan Anda akan terkirim langsung ke WhatsApp kami untuk konfirmasi ketersediaan & ongkir.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label className="text-sm font-medium text-clay-800">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-clay-800">Nomor WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
              placeholder="08xx xxxx xxxx"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-clay-800">Kategori Produk</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-clay-800">Detail Pesanan (opsional)</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
              placeholder="Jumlah, ukuran, warna, atau permintaan khusus lainnya"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3 text-sm font-medium text-white hover:bg-clay-800"
          >
            <Send size={16} />
            Kirim Pesanan via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}