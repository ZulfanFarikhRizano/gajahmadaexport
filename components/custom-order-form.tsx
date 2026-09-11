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
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setError("Name and contact details are required.");
      return;
    }
    const cleanNumber = waNumber.replace(/[^0-9]/g, "");
    const lines = [
      "Hello, I would like to request a Custom / Bespoke Order inquiry:",
      "",
      `Name: ${name}`,
      `Contact Details: ${contact}`,
      dimensions.trim() ? `Desired Dimensions: ${dimensions}` : null,
      notes.trim() ? `Project Notes / Specifications: ${notes}` : null,
      imageUrl ? `Reference Image: ${imageUrl}` : "Reference Image: (Not uploaded)",
    ].filter(Boolean);

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-clay-800">Your Name</label>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. John Doe"
          className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" 
        />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Email or WhatsApp Number</label>
        <input 
          value={contact} 
          onChange={(e) => setContact(e.target.value)} 
          placeholder="e.g. john@example.com or +123456789"
          className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" 
        />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Desired Dimensions & Size</label>
        <input 
          value={dimensions} 
          onChange={(e) => setDimensions(e.target.value)} 
          placeholder='e.g. "Length 150cm, Height 80cm"' 
          className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" 
        />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Project Requirements / Pattern Notes</label>
        <textarea 
          rows={3} 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Describe your design, material preferences, or project requirements..."
          className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600" 
        />
      </div>
      <div>
        <label className="text-sm font-medium text-clay-800">Sketch or Moodboard Reference (Optional)</label>
        {imageUrl ? (
          <img src={imageUrl} alt="Reference Sketch" className="mt-2 h-24 w-24 rounded-lg object-cover" />
        ) : (
          <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-clay-950/20 px-4 py-2 text-sm text-clay-800 hover:border-terracotta-600">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload image"}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} 
            />
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3 text-sm font-medium text-white hover:bg-clay-800">
        <Send size={16} />
        Send Inquiry via WhatsApp
      </button>
    </form>
  );
}