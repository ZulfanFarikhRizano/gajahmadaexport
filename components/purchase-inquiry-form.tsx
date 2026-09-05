"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { buildInquiryWhatsAppLink } from "@/lib/whatsapp";

export function PurchaseInquiryForm({ waNumber }: { waNumber: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }
    setError(null);
    const link = buildInquiryWhatsAppLink(waNumber, {
      name,
      phone: email, // Oper email/info kontak ke helper WA
      categoryLabel: subject || "General Inquiry",
      message,
    });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="order" className="bg-[#121212] py-16 px-6">
      <div className="mx-auto max-w-2xl rounded-3xl bg-[#1a1a1a] p-8 md:p-10 text-white border border-neutral-800">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 text-white">
          Send us a message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-2xl bg-[#121212] border border-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="w-full rounded-2xl bg-[#121212] border border-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full rounded-2xl bg-[#121212] border border-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              className="w-full rounded-2xl bg-[#121212] border border-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600 transition-colors resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ccff00] py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform active:scale-[0.99] hover:opacity-90"
          >
            SEND MESSAGE <Send size={16} className="fill-black stroke-black" />
          </button>
        </form>
      </div>
    </section>
  );
}