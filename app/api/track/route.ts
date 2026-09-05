import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function deriveSource(referrer: string, host: string): string {
  if (!referrer) return "Direct";
  try {
    const refHost = new URL(referrer).hostname.toLowerCase();
    if (refHost.includes(host)) return "Direct";
    if (refHost.includes("google")) return "Google";
    if (refHost.includes("facebook") || refHost.includes("fb.com")) return "Facebook";
    if (refHost.includes("instagram")) return "Instagram";
    if (refHost.includes("whatsapp") || refHost.includes("wa.me")) return "WhatsApp";
    if (refHost.includes("t.co") || refHost.includes("twitter") || refHost.includes("x.com")) return "Twitter/X";
    if (refHost.includes("tiktok")) return "TikTok";
    if (refHost.includes("bing")) return "Bing";
    return refHost;
  } catch {
    return "Direct";
  }
}

function deriveDevice(ua: string): string {
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  return "Desktop";
}

function deriveBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  if (/firefox\//i.test(ua)) return "Firefox";
  return "Lainnya";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const path: string = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    const referrer: string = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";
    const ua = request.headers.get("user-agent") || "";
    const host = request.headers.get("host") || "";

    const payload = {
      path,
      referrer: referrer || null,
      referrer_source: deriveSource(referrer, host),
      device_type: deriveDevice(ua),
      browser: deriveBrowser(ua),
    };

    // Gunakan (supabaseAdmin() as any) agar TypeScript tidak mengecek schema database yang belum di-generate
    await (supabaseAdmin() as any).from("page_views").insert(payload);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}