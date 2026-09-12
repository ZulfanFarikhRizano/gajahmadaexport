"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import FloatingMenu from "./floating-menu";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

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

  React.useEffect(() => {
    router.prefetch("/admin/login");
  }, [router]);

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
    <header className="sticky top-0 z-40 bg-cream-50/90 dark:bg-clay-950/90 backdrop-blur-md border-b border-clay-950/10 dark:border-white/10 transition-colors duration-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "320px 320px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative mx-auto flex items-center justify-between max-w-7xl h-16 sm:h-20 px-3 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Language Switcher & Theme Toggle (Desktop) */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>

        {/* Logo Tengah */}
        <button
          onClick={handleLogoTap}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 select-none"
          aria-label={siteName}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl || PLACEHOLDER_IMAGE}
            alt={siteName}
            className="h-12 w-12 sm:h-20 sm:w-20 md:h-24 md:w-24 object-contain drop-shadow-md"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </button>

        {/* Sisi Kanan: Menu + Theme Toggle (Mobile) */}
        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
          <FloatingMenu
            items={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Gallery", href: "/gallery" },
              { label: "Custom Order", href: "/custom-order" },
              { label: "Contact Us", href: "/contact" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}