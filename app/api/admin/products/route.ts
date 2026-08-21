import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/data-store";
import { CATEGORIES } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, category, description, price, images } = body;

  if (!name || !category || !description) {
    return NextResponse.json(
      { error: "name, category, dan description wajib diisi." },
      { status: 400 },
    );
  }

  if (!CATEGORIES.some((c) => c.slug === category)) {
    return NextResponse.json({ error: "Kategori tidak valid." }, { status: 400 });
  }

  const product = await createProduct({
    name,
    category,
    description,
    price: price ?? "Hubungi kami",
    images: Array.isArray(images) ? images : [],
  });

  return NextResponse.json({ product }, { status: 201 });
}
