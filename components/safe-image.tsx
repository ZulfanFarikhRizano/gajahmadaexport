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
  const [triedExtensions, setTriedExtensions] = useState<string[]>([]);
  const [baseFileName, setBaseFileName] = useState<string>("");

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
      return;
    }

    const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
    const initialUrl = `${SUPABASE_STORAGE_URL}/${cleanPath}`;

    // Ambil nama dasar file tanpa ekstensi (misal: "acc-001")
    const lastDotIndex = cleanPath.lastIndexOf(".");
    const baseName =
      lastDotIndex !== -1 ? cleanPath.substring(0, lastDotIndex) : cleanPath;

    setBaseFileName(baseName);
    setImgSrc(initialUrl);

    // Dapatkan ekstensi awal dari file
    const currentExt =
      lastDotIndex !== -1 ? cleanPath.substring(lastDotIndex).toLowerCase() : "";
    setTriedExtensions([currentExt]);
  }, [src]);

  const handleError = () => {
    // Cari ekstensi yang belum pernah dicoba
    const nextExt = EXTENSIONS.find((ext) => !triedExtensions.includes(ext));

    if (nextExt && baseFileName) {
      setTriedExtensions((prev) => [...prev, nextExt]);
      setImgSrc(`${SUPABASE_STORAGE_URL}/${baseFileName}${nextExt}`);
    } else {
      // Jika semua ekstensi (.png, .jpg, .jpeg, .webp) sudah dicoba dan tetap 404, baru ganti ke placeholder
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