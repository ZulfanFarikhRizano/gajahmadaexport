import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    hasUrl: !!url,
    hasKey: !!key,
    urlHost: url ? new URL(url).host : null,
    keyLength: key?.length ?? 0,
    keyPrefix: key?.slice(0, 8) ?? null,
    keySuffix: key ? key.slice(-4) : null,
  });
}