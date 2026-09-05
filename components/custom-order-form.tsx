"use client";

import { useState } from "react";
import { Upload, Send } from "lucide-react";

export function CustomOrderForm({ waNumber }: { waNumber: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/custom-order/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError("Nama dan kontak wajib diisi.");
      return;
    }
    const lines = [
      "Halo, saya ingin request Custom Order / Bespoke:",
      "",
      `Nama: ${name}`,
      `Kontak: ${contact}`,
      dimensions.trim() ? `Ukuran/dimensi diinginkan: ${dimensions}` : null,
      notes.trim() ? `Catatan: ${notes}` : null,
      imageUrl ? `Referensi gambar: ${imageUrl}` : "Referensi gambar: (tidak diunggah)",
    ].filter(Boolean);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-clay-800">Nama</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Email / WhatsApp Anda</label>
        <input value={contact} onChange={(e) => setContact(e.target.value)} className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Ukuran / Dimensi Diinginkan</label>
        <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder='mis. "Panjang 150cm, tinggi 80cm"' className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Catatan Motif / Kebutuhan Proyek</label>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Referensi Sketsa / Moodboard (opsional)</label>
        {imageUrl ? (
          <img src={imageUrl} alt="Referensi" className="mt-2 h-24 w-24 rounded-lg object-cover" />
        ) : (
          <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-clay-950/20 px-4 py-2 text-sm text-clay-800 hover:border-terracotta-600">
            <Upload size={16} />
            {uploading ? "Mengunggah..." : "Unggah gambar"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3 text-sm font-medium text-white hover:bg-clay-800">
        <Send size={16} />
        Kirim Permintaan via WhatsApp
      </button>
    </form>
  );
}