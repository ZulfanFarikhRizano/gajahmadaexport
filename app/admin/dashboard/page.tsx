"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, Pencil, Plus, Upload, CheckCircle2, AlertTriangle, FileText, BarChart2, Eye } from "lucide-react";
import { CATEGORIES, type Product, type SiteContent } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

type Tab = "content" | "products";

const emptyDraft = {
  name: "",
  category: CATEGORIES[0].slug,
  description: "",
  price: "Hubungi kami",
  images: [] as string[],
};

function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER_IMAGE;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("content");
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState(emptyDraft);
  const [savingContent, setSavingContent] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [notice, setNotice] = React.useState<{ type: "ok" | "error"; text: string } | null>(null);

  const flash = (type: "ok" | "error", text: string) => {
    setNotice({ type, text });
    if (type === "ok") setTimeout(() => setNotice(null), 3000);
  };

  const loadAll = React.useCallback(async () => {
    try {
      const [contentRes, productsRes] = await Promise.all([
        fetch("/api/admin/site-content"),
        fetch("/api/admin/products"),
      ]);

      if (!contentRes.ok) {
        const errText = await contentRes.text();
        throw new Error(`Error site-content: ${errText}`);
      }

      if (!productsRes.ok) {
        const errText = await productsRes.text();
        throw new Error(`Error products: ${errText}`);
      }

      const { siteContent } = await contentRes.json();
      const { products } = await productsRes.json();
      setSiteContent(siteContent);
      setProducts(products);
    } catch (err) {
      flash(
        "error",
        err instanceof Error ? err.message : "Gagal terhubung ke database."
      );
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const saveContent = async () => {
    if (!siteContent) return;
    setSavingContent(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteContent),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gagal menyimpan: ${errText}`);
      }

      const data = await res.json();
      setSiteContent(data.siteContent);
      flash("ok", "Perubahan tersimpan.");
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSavingContent(false);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fileType = file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg");

      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: fileType,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gagal mendapatkan izin upload: ${errorText}`);
      }

      const data = await res.json();

      const uploadRes = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file ke Supabase Storage.");
      }

      return data.publicUrl as string;
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Upload gagal.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    const url = await uploadFile(file);
    if (url && siteContent) {
      setSiteContent({ ...siteContent, logoUrl: url });
      flash("ok", 'Logo terunggah — klik "Simpan Perubahan" di bawah untuk menerapkannya.');
    }
  };

  const handleCatalogPdfUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      flash("error", "File harus berformat PDF.");
      return;
    }

    const url = await uploadFile(file);
    if (url && siteContent) {
      setSiteContent({ ...siteContent, catalogUrl: url });
      flash(
        "ok",
        'File E-Catalog PDF berhasil terunggah — klik "Simpan Perubahan" di bawah untuk menerapkannya.'
      );
    }
  };

  const handleProductImageUpload = async (file: File) => {
    const url = await uploadFile(file);
    if (url) setDraft((d) => ({ ...d, images: [...d.images, url] }));
  };

  const resetDraft = () => {
    setDraft(emptyDraft);
    setEditingId(null);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price ?? "",
      images: product.images || [],
    });
    setTab("products");
  };

  const submitProduct = async () => {
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Gagal menyimpan produk: ${errText}`);
        }

        const data = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === editingId ? data.product : p)));
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Gagal menambah produk: ${errText}`);
        }

        const data = await res.json();
        setProducts((prev) => [...prev, data.product]);
      }
      flash("ok", "Produk tersimpan.");
      resetDraft();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeProduct = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gagal menghapus produk: ${errText}`);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetDraft();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Gagal menghapus produk.");
    }
  };

  if (!siteContent) {
    return (
      <div className="p-10 text-clay-600">
        {notice ? notice.text : "Memuat..."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="flex items-center justify-between border-b border-clay-950/10 bg-white px-6 py-4">
        <h1 className="font-display text-lg font-medium text-clay-950">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-clay-600 hover:text-terracotta-600"
        >
          <LogOut size={16} /> Keluar
        </button>
      </header>

      {notice && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2 rounded-xl px-4 py-3 text-sm shadow-lg ${
            notice.type === "ok"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notice.type === "ok" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {(["content", "products"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  tab === t
                    ? "bg-terracotta-600 text-white"
                    : "bg-white text-clay-600 border border-clay-950/10"
                }`}
              >
                {t === "content" ? "Logo & Teks Website" : "Produk"}
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push("/admin/analytics")}
            className="flex items-center gap-2 rounded-full border border-clay-950/10 bg-white px-4 py-2 text-sm font-medium text-clay-800 hover:border-terracotta-600 hover:text-terracotta-600 shadow-sm transition-all"
          >
            <BarChart2 size={16} />
            <span>Analitik Trafik</span>
          </button>
        </div>

        {tab === "content" && (
          <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <label className="text-sm font-medium text-clay-800">Logo</label>
              <div className="mt-2 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={siteContent.logoUrl || PLACEHOLDER_IMAGE}
                  alt="Logo"
                  onError={onImgError}
                  className="h-14 w-14 rounded-lg object-contain border border-clay-950/10"
                />
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-clay-950/20 px-4 py-2 text-sm text-clay-800 hover:border-terracotta-600">
                  <Upload size={16} />
                  {uploading ? "Mengunggah..." : "Ganti logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div className="border-t border-clay-950/10 pt-4">
              <label className="text-sm font-medium text-clay-800">File E-Catalog (PDF)</label>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {siteContent.catalogUrl ? (
                  <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <FileText size={16} />
                      <span>File PDF aktif</span>
                    </div>
                    <a
                      href={siteContent.catalogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 underline hover:text-blue-800"
                    >
                      <Eye size={12} />
                      Lihat PDF
                    </a>
                  </div>
                ) : (
                  <span className="text-sm text-clay-500 italic">Belum ada file E-Catalog PDF yang diunggah</span>
                )}

                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-clay-950/20 px-4 py-2 text-sm text-clay-800 hover:border-terracotta-600">
                  <Upload size={16} />
                  {uploading ? "Mengunggah..." : siteContent.catalogUrl ? "Ganti File PDF" : "Unggah File PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleCatalogPdfUpload(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <Field
              label="Nama Website"
              value={siteContent.siteName}
              onChange={(v) => setSiteContent({ ...siteContent, siteName: v })}
            />
            <Field
              label="Judul Hero"
              value={siteContent.heroHeadline}
              onChange={(v) => setSiteContent({ ...siteContent, heroHeadline: v })}
            />
            <Field
              label="Sub-judul Hero"
              value={siteContent.heroSubheadline}
              onChange={(v) => setSiteContent({ ...siteContent, heroSubheadline: v })}
            />
            <Field
              label="Nomor WhatsApp (format: 628xxxxxxxxxx)"
              value={siteContent.whatsappNumber}
              onChange={(v) => setSiteContent({ ...siteContent, whatsappNumber: v })}
            />
            <Field
              label="Alamat"
              value={siteContent.contactAddress}
              onChange={(v) => setSiteContent({ ...siteContent, contactAddress: v })}
            />
            <div>
              <label className="text-sm font-medium text-clay-800">Teks About Us</label>
              <textarea
                rows={4}
                value={siteContent.aboutText}
                onChange={(e) => setSiteContent({ ...siteContent, aboutText: e.target.value })}
                className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
              />
            </div>

            <button
              onClick={saveContent}
              disabled={savingContent}
              className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-800 disabled:opacity-60"
            >
              {savingContent ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg text-clay-950">
                {editingId ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <div className="space-y-4">
                <Field
                  label="Nama Produk"
                  value={draft.name}
                  onChange={(v) => setDraft({ ...draft, name: v })}
                />

                <div>
                  <label className="text-sm font-medium text-clay-800">Kategori</label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-clay-800">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
                  />
                </div>

                <Field
                  label="Harga (bebas teks)"
                  value={draft.price}
                  onChange={(v) => setDraft({ ...draft, price: v })}
                />

                <div>
                  <label className="text-sm font-medium text-clay-800">Gambar</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {draft.images.map((src, i) => (
                      <div key={`${src}-${i}`} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src || PLACEHOLDER_IMAGE}
                          alt=""
                          onError={onImgError}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              images: d.images.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                          aria-label="Hapus gambar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-clay-950/20 text-clay-600 hover:border-terracotta-600">
                      {uploading ? (
                        <span className="text-[10px] text-center px-1">Mengunggah...</span>
                      ) : (
                        <Plus size={20} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) =>
                          e.target.files?.[0] && handleProductImageUpload(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={submitProduct}
                    disabled={!draft.name || !draft.description || submitting}
                    className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-800 disabled:opacity-60"
                  >
                    {submitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"}
                  </button>
                  {editingId && (
                    <button
                      onClick={resetDraft}
                      className="rounded-full border border-clay-950/20 px-6 py-2.5 text-sm text-clay-600"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg text-clay-950">
                Semua Produk ({products.length})
              </h2>
              <div className="divide-y divide-clay-950/10">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER_IMAGE}
                      alt={product.name}
                      onError={onImgError}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-clay-950">{product.name}</p>
                      <p className="text-xs text-clay-600">
                        {CATEGORIES.find((c) => c.slug === product.category)?.label}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(product)}
                      className="rounded-full p-2 text-clay-600 hover:text-terracotta-600"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="rounded-full p-2 text-clay-600 hover:text-red-600"
                      aria-label="Hapus"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-clay-800">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
      />
    </div>
  );
}