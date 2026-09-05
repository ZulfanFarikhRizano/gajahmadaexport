import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteContent = await getSiteContent();
    return NextResponse.json({ siteContent });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengambil site content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const patch = await request.json();
    const siteContent = await updateSiteContent(patch);
    return NextResponse.json({ siteContent });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui site content" },
      { status: 500 }
    );
  }
}

// Tambahkan handler OPTIONS untuk meloloskan CORS/preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Allow": "GET, PUT, OPTIONS",
    },
  });
}