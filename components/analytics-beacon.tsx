"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Tidak merender apa pun — cuma mengirim satu ping ringan tiap ganti halaman. */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}