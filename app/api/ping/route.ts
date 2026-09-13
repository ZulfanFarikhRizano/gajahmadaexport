import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    // Query paling ringan cuma ambil 1 baris data
    const { data, error } = await supabaseAdmin()
      .from("site_content")
      .select("id")
      .eq("id", 1)
      .single();

    if (error) throw error;

    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}