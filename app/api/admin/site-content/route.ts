import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteContent = await getSiteContent();
  return NextResponse.json({ siteContent });
}

export async function PUT(request: NextRequest) {
  const patch = await request.json();
  const siteContent = await updateSiteContent(patch);
  return NextResponse.json({ siteContent });
}