"use client";

import { useState, useEffect } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";

const SUPABASE_STORAGE_URL =
  "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads";

const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

interface SafeImageProps {
  src?: any;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function SafeImage({ src, alt, className = "", fill }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(PLACEHOLDER_IMAGE);
  const [baseFileName, setBaseFileName] = useState<string>("");
  const [currentExtIndex, setCurrentExtIndex] = useState<number>(-1);

  useEffect(() => {
    let rawPath = src;

    if (Array.isArray(rawPath) && rawPath.length > 0) rawPath = rawPath[0];
    if (typeof rawPath === "string" && rawPath.startsWith("[")) {
      try {
        const parsed = JSON.parse(rawPath);
        if (Array.isArray(parsed) && parsed.length > 0) rawPath = parsed[0];
      } catch (e) {}
    }

    if (!rawPath || typeof rawPath !== "string" || rawPath.trim() === "") {
      setImgSrc(PLACEHOLDER_IMAGE);
      return;
    }

    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
      setImgSrc(rawPath);
      setCurrentExtIndex(99); // bypass fallback
      return;
    }

    const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;

    // Ambil nama dasar file tanpa ekstensi (misal: "tbi-002")
    const lastDotIndex = cleanPath.lastIndexOf(".");
    const baseName =
      lastDotIndex !== -1 ? cleanPath.substring(0, lastDotIndex) : cleanPath;

    setBaseFileName(baseName);
    setCurrentExtIndex(0);
    // Langsung tembak ekstensi pertama (.png)
    setImgSrc(`${SUPABASE_STORAGE_URL}/${baseName}${EXTENSIONS[0]}`);
  }, [src]);

  const handleError = () => {
    // Jika index masih dalam jangkauan EXTENSIONS
    const nextIndex = currentExtIndex + 1;

    if (nextIndex < EXTENSIONS.length) {
      setCurrentExtIndex(nextIndex);
      setImgSrc(`${SUPABASE_STORAGE_URL}/${baseFileName}${EXTENSIONS[nextIndex]}`);
    } else {
      // Jika semua (.png, .jpg, .jpeg, .webp) sudah dicoba dan tetap 404
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  const fillClass = fill ? "absolute inset-0 w-full h-full" : "";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={`${fillClass} ${className}`.trim()}
      onError={handleError}
    />
  );
}