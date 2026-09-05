import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const BUCKET = "uploads";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Gunakan JPG, PNG, atau WEBP." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 5MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `custom-orders/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = supabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType: file.type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}