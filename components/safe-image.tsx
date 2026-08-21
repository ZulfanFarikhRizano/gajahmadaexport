"use client";

import { PLACEHOLDER_IMAGE } from "@/lib/constants";

export function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = PLACEHOLDER_IMAGE;
      }}
    />
  );
}
