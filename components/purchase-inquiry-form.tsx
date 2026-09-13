"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function PurchaseInquiryForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!whatsapp.trim()) {
      setError("WhatsApp number is required.");
      return;
    }
    setError(null);

    const emailTarget = "inquiry@gajahmadaexport.com";
    const emailSubject = encodeURIComponent(subject || "Purchase Inquiry");
    
    const emailBody = encodeURIComponent(
      `Name: ${name}\nWhatsApp: ${whatsapp}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${emailTarget}?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <section 
      id="order" 
      className="relative bg-cream-100 py-16 px-6 overflow-hidden"
    >
      {/* 1. BACKGROUND BATIK GAJAH (Pastikan path file sesuai) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage: "url('/batik-gajah.png')", // Jika di folder public/images, ganti ke '/images/batik-gajah.png'
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 2. OVERLAY TRANSPARAN TIPIS (Agar form kontras) */}
      <div className="absolute inset-0 bg-cream-100/30 pointer-events-none z-0" />

      {/* 3. CONTENT FORM */}
      <div className="relative z-10 mx-auto max-w-xl rounded-2xl bg-white p-6 md:p-8 shadow-md border border-clay-100">
        <h2 className="font-display text-2xl font-medium text-clay-950 mb-6">
          Send us a message
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-lg border border-clay-950/20 px-3 py-2 text-sm text-clay-950 placeholder-clay-400 outline-none focus:border-terracotta-600"
            />
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Your WhatsApp"
              className="w-full rounded-lg border border-clay-950/20 px-3 py-2 text-sm text-clay-950 placeholder-clay-400 outline-none focus:border-terracotta-600"
            />
          </div>

          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full rounded-lg border border-clay-950/20 px-3 py-2 text-sm text-clay-950 placeholder-clay-400 outline-none focus:border-terracotta-600"
            />
          </div>

          <div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              className="w-full rounded-lg border border-clay-950/20 px-3 py-2 text-sm text-clay-950 placeholder-clay-400 outline-none focus:border-terracotta-600 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3 text-sm font-medium text-white hover:bg-clay-800 transition-colors uppercase"
          >
            Send Message <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}