"use client";

import { PLACEHOLDER_IMAGE } from "@/lib/constants";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean; // Ditambahkan agar TypeScript tidak error saat dipanggil dengan prop fill
  sizes?: string; // Ditambahkan agar mendukung props sizes jika ada
}

export function SafeImage({
  src,
  alt,
  className = "",
  fill,
  sizes,
}: SafeImageProps) {
  // Jika fill=true, kita tambahkan style CSS agar gambarnya memenuhi kontainer parent-nya (mirip behavior Next.js Image)
  const fillClass = fill ? "absolute inset-0 w-full h-full" : "";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src && src.trim() !== "" ? src : PLACEHOLDER_IMAGE}
      alt={alt}
      className={`${fillClass} ${className}`.trim()}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = PLACEHOLDER_IMAGE;
      }}
    />
  );
}