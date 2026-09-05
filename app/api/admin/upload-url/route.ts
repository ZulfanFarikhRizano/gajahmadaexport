import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename dan contentType dibutuhkan." },
        { status: 400 }
      );
    }

    const ext = filename.split(".").pop() || "pdf";
    const path = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

    const supabase = supabaseAdmin();
    
    // 1. Buat signed upload URL
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(path);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 2. Ambil Public URL dengan path yang persis sama
    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(path);

    return NextResponse.json({
      signedUrl: uploadData.signedUrl,
      publicUrl: publicData.publicUrl,
      path: uploadData.path,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat URL upload." },
      { status: 500 }
    );
  }
}