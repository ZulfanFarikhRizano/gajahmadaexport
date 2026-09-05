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
    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(path);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage
      .from("uploads")
      .getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      publicUrl: publicData.publicUrl,
      path: data.path,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat URL upload." },
      { status: 500 }
    );
  }
}