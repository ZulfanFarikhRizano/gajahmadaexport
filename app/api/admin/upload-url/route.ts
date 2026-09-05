import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = supabaseAdmin();

    // Mapping dari camelCase ke nama kolom database (snake_case)
    const updateData = {
      site_name: body.siteName,
      hero_headline: body.heroHeadline,
      hero_subheadline: body.heroSubheadline,
      logo_url: body.logoUrl,
      catalog_url: body.catalogUrl ?? body.catalog_url, // PERHATIKAN INI! Pastikan catalog_url terisi
      whatsapp_number: body.whatsappNumber,
      contact_address: body.contactAddress,
      about_text: body.aboutText,
    };

    // Sesuaikan ID row yang kamu pakai (misal id: 1 atau match single row)
    const { data, error } = await supabase
      .from("site_content")
      .update(updateData)
      .eq("id", 1) // Sesuaikan ID site_content di database kamu
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Kembalikan format camelCase ke frontend
    const siteContent = {
      siteName: data.site_name,
      heroHeadline: data.hero_headline,
      heroSubheadline: data.hero_subheadline,
      logoUrl: data.logo_url,
      catalogUrl: data.catalog_url,
      whatsappNumber: data.whatsapp_number,
      contactAddress: data.contact_address,
      aboutText: data.about_text,
    };

    return NextResponse.json({ siteContent });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal menyimpan." },
      { status: 500 }
    );
  }
}