import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/data-store";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const patch = await request.json();
  const product = await updateProduct(params.id, patch);
  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const deleted = await deleteProduct(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
