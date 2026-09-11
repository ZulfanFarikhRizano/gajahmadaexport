import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imgParam = searchParams.get("img") || "";

  let imageUrl = "";
  if (imgParam) {
    let clean = imgParam.trim();
    if (!clean.endsWith(".webp")) clean = clean.replace(/\.[^/.]+$/, "") + ".webp";
    imageUrl = clean.startsWith("http")
      ? clean
      : `${SUPABASE_STORAGE_URL}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Product"
            style={{
              width: "600px",
              height: "600px",
              objectFit: "cover",
            }}
          />
        ) : null}
      </div>
    ),
    {
      width: 600,
      height: 600,
      headers: {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, immutable",
      },
    }
  );
}