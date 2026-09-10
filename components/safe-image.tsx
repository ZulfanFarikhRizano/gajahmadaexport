"use client";

import { useState, useEffect } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function SafeImage({
  src,
  alt,
  className = "",
  fill,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(PLACEHOLDER_IMAGE);

  useEffect(() => {
    if (!src || typeof src !== "string" || src.trim() === "") {
      setImgSrc(PLACEHOLDER_IMAGE);
      return;
    }

    // Jika src sudah berupa URL lengkap (https://...)
    if (src.startsWith("http://") || src.startsWith("https://")) {
      setImgSrc(src);
      return;
    }

    // Jika src hanya nama file (misal: "acc-004.png"), sambungkan ke Supabase Storage
    const cleanFileName = src.startsWith("/") ? src.slice(1) : src;
    setImgSrc(`${SUPABASE_STORAGE_URL}/${cleanFileName}`);
  }, [src]);

  const fillClass = fill ? "absolute inset-0 w-full h-full" : "";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={`${fillClass} ${className}`.trim()}
      onError={() => {
        if (imgSrc !== PLACEHOLDER_IMAGE) {
          setImgSrc(PLACEHOLDER_IMAGE);
        }
      }}
    />
  );
}