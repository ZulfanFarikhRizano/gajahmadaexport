"use client";

import { useState } from "react";
import { MapPin, Mail, MessageCircle, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const emailTarget = "inquiry@gajahmadaexport.com";
  const whatsappNumber = "628212334275";
  const address = "Cirebon, West Java, Indonesia";

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

    const emailSubject = encodeURIComponent(subject || "General Inquiry");
    const emailBody = encodeURIComponent(
      `Name: ${name}\nWhatsApp: ${whatsapp}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${emailTarget}?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
        
        {/* KOLOM KIRI: Get in Touch & Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-clay-950 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-2 text-sm text-clay-600">
              Lets Talk with our Team
            </p>
          </div>

          <div className="space-y-6 text-sm text-clay-800">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">Address</p>
                <p className="mt-0.5 text-clay-600 leading-relaxed">
                  {address}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">Email</p>
                <a
                  href={`mailto:${emailTarget}`}
                  className="mt-0.5 block text-clay-600 hover:text-terracotta-600 transition-colors"
                >
                  {emailTarget}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">WhatsApp</p>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-clay-600 hover:text-terracotta-600 transition-colors"
                >
                  {whatsappNumber}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-terracotta-600">
                <Phone size={18} />
              </div>
              <div>
                <p className="font-semibold text-clay-950">Phone</p>
                <a
                  href={`tel:${whatsappNumber}`}
                  className="mt-0.5 block text-clay-600 hover:text-terracotta-600 transition-colors"
                >
                  {whatsappNumber}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Form Send us a message */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-clay-900/5 border border-clay-100/80">
            <h2 className="font-display text-2xl font-medium text-clay-950 mb-6">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Your WhatsApp"
                    className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-clay-200 bg-cream-50/30 px-4 py-3 text-sm text-clay-900 placeholder:text-clay-400 focus:border-terracotta-600 focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-terracotta-700 active:scale-[0.99] transition-all"
              >
                SEND MESSAGE
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}