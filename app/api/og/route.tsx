import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

// Gambar fallback super ringan jika gambar Supabase bermasalah
const FALLBACK_IMAGE = "https://gajahmadaexport.com/images/legal-wood.png";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imgParam = searchParams.get("img") || "";

    let imageUrl = FALLBACK_IMAGE;

    if (imgParam && imgParam.trim() !== "") {
      let clean = imgParam.trim();
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        imageUrl = clean;
      } else {
        // Otomatis pastikan ekstensi .webp jika disimpan di Supabase
        if (!clean.endsWith(".webp")) {
          clean = clean.replace(/\.[^/.]+$/, "") + ".webp";
        }
        const cleanFileName = clean.startsWith("/") ? clean.slice(1) : clean;
        imageUrl = `${SUPABASE_STORAGE_URL}/${cleanFileName}`;
      }
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
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Product Preview"
            style={{
              width: "600px",
              height: "600px",
              objectFit: "cover",
            }}
          />
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
  } catch (err) {
    // Jika crash total, return response PNG kosong/status ok agar tidak bikin UI WhatsApp rusak
    return new Response("Error loading preview", { status: 200 });
  }
}