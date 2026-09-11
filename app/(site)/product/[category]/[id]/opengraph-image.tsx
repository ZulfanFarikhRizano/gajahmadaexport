import { ImageResponse } from "next/og";
import { getProductById } from "@/lib/data-store";

export const runtime = "edge";
export const alt = "Gajah Mada Export Product";
export const size = {
  width: 800,
  height: 800,
};
export const contentType = "image/png";

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

export default async function Image({
  params,
}: {
  params: { category: string; id: string };
}) {
  const product = await getProductById(params.id);

  let imageUrl = "";
  if (product && product.images && product.images.length > 0) {
    let raw = product.images[0].trim();
    if (!raw.endsWith(".webp")) raw = raw.replace(/\.[^/.]+$/, "") + ".webp";
    imageUrl = raw.startsWith("http")
      ? raw
      : `${SUPABASE_STORAGE_URL}/${raw.startsWith("/") ? raw.slice(1) : raw}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFBF7",
          padding: "40px",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product?.name || "Product"}
            style={{
              width: "680px",
              height: "680px",
              objectFit: "cover",
              borderRadius: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <div style={{ fontSize: 40, color: "#4A3E3D", fontWeight: "bold" }}>
            {product?.name || "Gajah Mada Export"}
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}