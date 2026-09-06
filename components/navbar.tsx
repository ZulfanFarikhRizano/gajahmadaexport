"use client";

import * as React from "react";
import Image from "next/image";
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
  const [imgSrc, setImgSrc] = React.useState(logoUrl || PLACEHOLDER_IMAGE);

  // Prefetch halaman admin di background agar instan saat diakses
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
    <header className="sticky top-0 z-40 bg-white border-b border-clay-950/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "url('/images/batik-pattern.png')",
          backgroundSize: "320px 320px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative mx-auto grid grid-cols-3 items-center max-w-7xl h-16 sm:h-20 px-3 sm:px-4 lg:px-8">
        <div className="justify-self-start min-w-0 overflow-hidden">
          <LanguageSwitcher />
        </div>

        <div />

        <div className="justify-self-end">
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

      <button
        onClick={handleLogoTap}
        className="absolute left-1/2 top-1/2 z-20 select-none -translate-x-1/2 -translate-y-[28%]"
        aria-label={siteName}
      >
        <div className="relative h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28">
          <Image
            src={imgSrc}
            alt={siteName}
            fill
            priority
            sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 112px"
            className="object-contain drop-shadow-lg"
            onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
          />
        </div>
      </button>
    </header>
  );
}