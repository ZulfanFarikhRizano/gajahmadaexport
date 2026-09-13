import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import type { Product, SiteContent } from "./types";

const db = () => supabaseAdmin() as any;

function mapProduct(data: any): Product {
  const cleanId = (data.id || "").toString().trim().toLowerCase();

  return {
    id: cleanId,
    name: data.name,
    category: data.category,
    description: data.description,
    price: data.price,
    images: Array.isArray(data.images) ? data.images : [],
    createdAt: data.created_at,
  };
}

// Helper untuk fetch aman dengan batas timeout
async function fetchWithTimeout<T>(
  queryFn: (signal: AbortSignal) => Promise<{ data: T | null; error: any }>,
  timeoutMs = 6000
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const { data, error } = await queryFn(controller.signal);
    clearTimeout(timer);
    if (error) {
      console.error("Supabase Query Error:", error.message);
      return null;
    }
    return data;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      console.error(`Database query timeout (${timeoutMs}ms)`);
    } else {
      console.error("Unexpected Database Fetch Error:", err);
    }
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  // Ambil max 200 produk terbaru agar tidak timeout. 
  // Jika butuh seleksi ringkas, hindari select * jika data tekstual sangat besar.
  const data = await fetchWithTimeout<any[]>((signal) =>
    db()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, 199)
      .abortSignal(signal)
  );

  return (data || []).map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const data = await fetchWithTimeout<any[]>((signal) =>
    db()
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .range(0, 199)
      .abortSignal(signal)
  );

  return (data || []).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const cleanId = (id || "").toString().trim().toLowerCase();

  const data = await fetchWithTimeout<any>((signal) =>
    db()
      .from("products")
      .select("*")
      .eq("id", cleanId)
      .maybeSingle()
      .abortSignal(signal)
  );

  return data ? mapProduct(data) : null;
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  const row = {
    id: `${input.category}-${Date.now()}`,
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    images: input.images,
  };

  const { data, error } = await db()
    .from("products")
    .insert([row])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapProduct(data);
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | null> {
  const cleanId = (id || "").toString().trim().toLowerCase();

  const { data, error } = await db()
    .from("products")
    .update(patch)
    .eq("id", cleanId)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProduct(data) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const cleanId = (id || "").toString().trim().toLowerCase();

  const { error, count } = await db()
    .from("products")
    .delete({ count: "exact" })
    .eq("id", cleanId);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function getSiteContent(): Promise<SiteContent> {
  const data = await fetchWithTimeout<any>((signal) =>
    db()
      .from("site_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .abortSignal(signal)
  );

  return {
    siteName: data?.site_name ?? "",
    logoUrl: data?.logo_url ?? "",
    catalogUrl: data?.catalog_url ?? "",
    heroHeadline: data?.hero_headline ?? "",
    heroSubheadline: data?.hero_subheadline ?? "",
    whatsappNumber: data?.whatsapp_number ?? "",
    aboutText: data?.about_text ?? "",
    contactAddress: data?.contact_address ?? "",
  };
}

export async function updateSiteContent(
  patch: Partial<SiteContent>
): Promise<SiteContent> {
  const row: Record<string, any> = {};
  if (patch.siteName !== undefined) row.site_name = patch.siteName;
  if (patch.logoUrl !== undefined) row.logo_url = patch.logoUrl;
  if (patch.catalogUrl !== undefined) row.catalog_url = patch.catalogUrl;
  if (patch.heroHeadline !== undefined) row.hero_headline = patch.heroHeadline;
  if (patch.heroSubheadline !== undefined) row.hero_subheadline = patch.heroSubheadline;
  if (patch.whatsappNumber !== undefined) row.whatsapp_number = patch.whatsappNumber;
  if (patch.aboutText !== undefined) row.about_text = patch.aboutText;
  if (patch.contactAddress !== undefined) row.contact_address = patch.contactAddress;

  const { error } = await db().from("site_content").update(row).eq("id", 1);
  if (error) throw new Error(error.message);

  return getSiteContent();
}