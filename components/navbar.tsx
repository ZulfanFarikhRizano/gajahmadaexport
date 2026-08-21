"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import FloatingMenu from "./floating-menu";
import { LanguageSwitcher } from "./language-switcher";

interface NavbarProps {
  siteName: string;
  logoUrl: string;
}

const ADMIN_TAP_COUNT = 5;
const ADMIN_TAP_WINDOW_MS = 1500;

export function Navbar({ siteName, logoUrl }: NavbarProps) {
  const router = useRouter();
  const tapCountRef = React.useRef(0);
  const tapTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, ADMIN_TAP_WINDOW_MS);

    if (tapCountRef.current >= ADMIN_TAP_COUNT) {
      tapCountRef.current = 0;
      router.push("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 relative bg-white border-b border-clay-950/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "320px 320px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Grid 3 kolom: masing-masing elemen punya jatah ruang sendiri,
          jadi tidak mungkin saling menimpa di layar sempit. */}
      <div className="relative mx-auto grid grid-cols-3 items-center max-w-7xl h-16 sm:h-20 px-3 sm:px-4 lg:px-8">
        <div className="justify-self-start min-w-0 overflow-hidden">
          <LanguageSwitcher />
        </div>

        <button
          onClick={handleLogoTap}
          className="justify-self-center select-none"
          aria-label={siteName}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={siteName}
            className="h-9 w-9 sm:h-14 sm:w-14 object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </button>

        <div className="justify-self-end">
          <FloatingMenu />
        </div>
      </div>
    </header>
  );
}