import { NextResponse } from "next/server";
import { getProducts, getSiteContent } from "@/lib/data-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  const [siteContent, products] = await Promise.all([
    getSiteContent(),
    getProducts(),
  ]);
  return NextResponse.json({ siteContent, products });
}
