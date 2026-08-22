import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import type { Product, SiteContent } from "./types";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return (data as Product) ?? null;
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt">,
): Promise<Product> {
  const row = {
    id: `${input.category}-${Date.now()}`,
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    images: input.images,
  };

  const { data, error } = await supabaseAdmin()
    .from("products")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Product;
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id" | "createdAt">>,
): Promise<Product | null> {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return (data as Product) ?? null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error, count } = await supabaseAdmin()
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function getSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabaseAdmin()
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw new Error(error.message);

  const content = data as Record<string, any>;

  return {
    siteName: content.site_name ?? "",
    logoUrl: content.logo_url ?? "",
    heroHeadline: content.hero_headline ?? "",
    heroSubheadline: content.hero_subheadline ?? "",
    whatsappNumber: content.whatsapp_number ?? "",
    aboutText: content.about_text ?? "",
    contactAddress: content.contact_address ?? "",
  };
}

export async function updateSiteContent(
  patch: Partial<SiteContent>,
): Promise<SiteContent> {
  const row: Record<string, string> = {};
  if (patch.siteName !== undefined) row.site_name = patch.siteName;
  if (patch.logoUrl !== undefined) row.logo_url = patch.logoUrl;
  if (patch.heroHeadline !== undefined) row.hero_headline = patch.heroHeadline;
  if (patch.heroSubheadline !== undefined) row.hero_subheadline = patch.heroSubheadline;
  if (patch.whatsappNumber !== undefined) row.whatsapp_number = patch.whatsappNumber;
  if (patch.aboutText !== undefined) row.about_text = patch.aboutText;
  if (patch.contactAddress !== undefined) row.contact_address = patch.contactAddress;

  const { error } = await supabaseAdmin().from("site_content").update(row).eq("id", 1);
  if (error) throw new Error(error.message);

  return getSiteContent();
}