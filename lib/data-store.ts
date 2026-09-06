import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { supabaseAdmin } from "./supabase/admin";
import type { Product, SiteContent } from "./types";

// Gunakan 'as any' khusus di instance client internal agar TypeScript tidak memaksa inferensi 'never'
const db = () => supabaseAdmin() as any;

// Helper untuk Mapping snake_case Supabase ke camelCase TypeScript
function mapProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    price: data.price,
    images: data.images || [],
    createdAt: data.created_at,
  };
}

export async function getProducts(): Promise<Product[]> {
  noStore();
  const { data, error } = await db()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  noStore();
  const { data, error } = await db()
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  noStore();
  const { data, error } = await db()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
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
  const { data, error } = await db()
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProduct(data) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error, count } = await db()
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function getSiteContent(): Promise<SiteContent> {
  noStore();
  const { data, error } = await db()
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw new Error(error.message);

  return {
    siteName: data.site_name,
    logoUrl: data.logo_url,
    catalogUrl: data.catalog_url ?? "",
    heroHeadline: data.hero_headline,
    heroSubheadline: data.hero_subheadline,
    whatsappNumber: data.whatsapp_number,
    aboutText: data.about_text,
    contactAddress: data.contact_address,
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