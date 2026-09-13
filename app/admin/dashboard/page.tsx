"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Trash2,
  Pencil,
  Plus,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2,
  Eye,
  MessageSquare,
  X,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, type Product, type SiteContent, type Testimonial } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { createClient } from "@supabase/supabase-js";

type Tab = "content" | "testimonials" | "products";

const emptyDraft = {
  name: "",
  category: CATEGORIES[0].slug,
  description: "",
  price: "Hubungi kami",
  images: [] as string[],
};

const emptyTestimonialDraft: Testimonial = {
  id: "",
  testimonial: "",
  by: "",
  imgSrc: "",
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

  // State Manajemen Testimoni
  const [testimonialDraft, setTestimonialDraft] = React.useState<Testimonial>(emptyTestimonialDraft);
  const [editingTestimonialId, setEditingTestimonialId] = React.useState<string | null>(null);
  const [uploadingTestiImg, setUploadingTestiImg] = React.useState(false);

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const channel = supabase
      .channel("realtime-admin-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => loadAll()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => loadAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAll]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const saveContent = async (customContent?: SiteContent) => {
    const payload = customContent || siteContent;
    if (!payload) return;
    setSavingContent(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        headers: { "Content-Type": fileType },
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
      flash("ok", 'Logo terunggah — klik "Simpan Perubahan" di bawah.');
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
      flash("ok", 'File E-Catalog PDF berhasil terunggah — klik "Simpan Perubahan" di bawah.');
    }
  };

  const handleProductImageUpload = async (file: File) => {
    const url = await uploadFile(file);
    if (url) setDraft((d) => ({ ...d, images: [...d.images, url] }));
  };

  // Upload Gambar untuk Testimoni Card
  const handleTestimonialImageUpload = async (file: File) => {
    setUploadingTestiImg(true);
    const url = await uploadFile(file);
    if (url) {
      setTestimonialDraft((prev) => ({ ...prev, imgSrc: url }));
    }
    setUploadingTestiImg(false);
  };

  // Manajemen Testimoni
  const handleSaveTestimonial = async () => {
    if (!siteContent) return;
    if (!testimonialDraft.testimonial || !testimonialDraft.by) {
      flash("error", "Isi teks testimoni dan nama/jabatan.");
      return;
    }

    const currentList = siteContent.testimonials || [];
    let updatedList: Testimonial[];

    if (editingTestimonialId) {
      updatedList = currentList.map((t) =>
        t.id === editingTestimonialId ? testimonialDraft : t
      );
    } else {
      const newTesti = {
        ...testimonialDraft,
        id: `testi-${Date.now()}`,
        imgSrc: testimonialDraft.imgSrc || PLACEHOLDER_IMAGE,
      };
      updatedList = [...currentList, newTesti];
    }

    const newSiteContent = { ...siteContent, testimonials: updatedList };
    setSiteContent(newSiteContent);
    await saveContent(newSiteContent);
    resetTestimonialDraft();
  };

  const handleEditTestimonial = (testi: Testimonial) => {
    setEditingTestimonialId(testi.id);
    setTestimonialDraft(testi);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!siteContent || !confirm("Hapus kartu testimoni ini?")) return;
    const updatedList = (siteContent.testimonials || []).filter((t) => t.id !== id);
    const newSiteContent = { ...siteContent, testimonials: updatedList };
    setSiteContent(newSiteContent);
    await saveContent(newSiteContent);
    if (editingTestimonialId === id) resetTestimonialDraft();
  };

  const resetTestimonialDraft = () => {
    setTestimonialDraft(emptyTestimonialDraft);
    setEditingTestimonialId(null);
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
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === editingId ? data.product : p)));
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!res.ok) throw new Error(await res.text());
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
      if (!res.ok) throw new Error(await res.text());
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

  const testimonialList = siteContent.testimonials || [];

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
            notice.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
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

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {[
              { id: "content", label: "Logo & Teks" },
              { id: "testimonials", label: `Testimoni Cards (${testimonialList.length})` },
              { id: "products", label: `Produk (${products.length})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-terracotta-600 text-white shadow"
                    : "bg-white text-clay-600 border border-clay-950/10 hover:border-terracotta-600/30"
                }`}
              >
                {t.label}
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

        {/* TAB 1: LOGO & CONTENT */}
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
              onClick={() => saveContent()}
              disabled={savingContent}
              className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-800 disabled:opacity-60"
            >
              {savingContent ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}

        {/* TAB 2: MANAJEMEN TESTIMONI CARDS (GUI MANAGER) */}
        {tab === "testimonials" && (
          <div className="space-y-8">
            {/* Form Input / Edit Testimoni Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-clay-950/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-clay-950 flex items-center gap-2">
                  <MessageSquare size={20} className="text-terracotta-600" />
                  {editingTestimonialId ? "Edit Kartu Testimoni" : "Tambah Kartu Testimoni Baru"}
                </h2>
                {editingTestimonialId && (
                  <button
                    onClick={resetTestimonialDraft}
                    className="flex items-center gap-1 text-xs text-clay-500 hover:text-clay-800"
                  >
                    <X size={14} /> Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Field */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-clay-800">Teks Testimoni (Bahasa Inggris/Indonesia)</label>
                    <textarea
                      rows={3}
                      placeholder="The rattan chair and table set for our cafe has been outdoors..."
                      value={testimonialDraft.testimonial}
                      onChange={(e) =>
                        setTestimonialDraft((prev) => ({ ...prev, testimonial: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 text-sm outline-none focus:border-terracotta-600"
                    />
                  </div>

                  <Field
                    label="Nama & Jabatan / Klien"
                    value={testimonialDraft.by}
                    onChange={(v) => setTestimonialDraft((prev) => ({ ...prev, by: v }))}
                  />

                  <div>
                    <label className="text-sm font-medium text-clay-800">Foto Avatar / Profil Klien</label>
                    <div className="mt-2 flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-full border border-clay-950/20 px-4 py-2 text-xs font-medium text-clay-800 hover:border-terracotta-600">
                        <Upload size={14} />
                        {uploadingTestiImg ? "Mengunggah Gambar..." : "Unggah foto dari perangkat"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] && handleTestimonialImageUpload(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveTestimonial}
                      disabled={savingContent || uploadingTestiImg}
                      className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-800 disabled:opacity-60 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      {editingTestimonialId ? "Simpan Perubahan Kartu" : "Tambahkan ke Display Cards"}
                    </button>
                  </div>
                </div>

                {/* Live Card Preview (GUI) */}
                <div className="flex flex-col justify-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-clay-500 mb-2 flex items-center gap-1">
                    <Sparkles size={12} className="text-brass-500" /> Live Visual Preview
                  </span>
                  <div className="relative border-2 border-terracotta-700 bg-terracotta-600 text-cream-50 p-6 rounded-xl shadow-md min-h-[220px] flex flex-col justify-between">
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimonialDraft.imgSrc || PLACEHOLDER_IMAGE}
                        alt="Preview"
                        onError={onImgError}
                        className="mb-3 h-12 w-10 rounded-md bg-muted object-cover object-top border border-white/20 shadow-sm"
                      />
                      <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-4">
                        &ldquo;{testimonialDraft.testimonial || "Tulis testimoni pelanggan di sini..."}&rdquo;
                      </p>
                    </div>
                    <p className="mt-3 text-xs italic font-light text-cream-100/80 truncate">
                      — {testimonialDraft.by || "Nama Pelanggan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid GUI Daftar Semua Kartu Testimoni */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-clay-950/5">
              <h2 className="mb-4 font-display text-lg text-clay-950">
                Daftar Display Cards Aktif ({testimonialList.length})
              </h2>

              {testimonialList.length === 0 ? (
                <p className="text-sm text-clay-500 italic">Belum ada kartu testimoni yang ditambahkan.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonialList.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                        editingTestimonialId === item.id
                          ? "border-terracotta-600 bg-terracotta-50/20 ring-2 ring-terracotta-600/20"
                          : "border-clay-950/10 bg-cream-50/50 hover:border-terracotta-600/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imgSrc || PLACEHOLDER_IMAGE}
                            alt={item.by}
                            onError={onImgError}
                            className="h-12 w-10 rounded-md object-cover object-top border border-clay-950/10 shadow-sm"
                          />
                          <span className="text-[10px] font-mono text-clay-400 bg-white px-2 py-0.5 rounded border border-clay-200">
                            #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-clay-900 leading-relaxed font-medium line-clamp-3">
                          &ldquo;{item.testimonial}&rdquo;
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-clay-950/10 flex items-center justify-between">
                        <span className="text-xs font-medium text-clay-600 truncate max-w-[140px]">
                          {item.by}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditTestimonial(item)}
                            className="rounded-md p-1.5 text-clay-600 hover:bg-white hover:text-terracotta-600 border border-transparent hover:border-clay-200"
                            title="Edit Kartu"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(item.id)}
                            className="rounded-md p-1.5 text-clay-600 hover:bg-white hover:text-red-600 border border-transparent hover:border-clay-200"
                            title="Hapus Kartu"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUK */}
        {tab === "products" && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-clay-950/5">
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
                  <label className="text-sm font-medium text-clay-800">Gambar Produk</label>
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

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-clay-950/5">
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
        className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 text-sm outline-none focus:border-terracotta-600"
      />
    </div>
  );
}