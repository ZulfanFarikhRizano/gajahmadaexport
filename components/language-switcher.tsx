"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Globe, Check, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文 (Chinese)" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "ko", label: "한국어 (Korean)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "nl", label: "Nederlands" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("id");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 1. Cek cookie terjemahan saat halaman dimuat
    const cookies = document.cookie.split("; ");
    const googtrans = cookies.find((row) => row.startsWith("googtrans="));
    if (googtrans) {
      const val = googtrans.split("=")[1];
      const lang = val?.split("/").pop();
      if (lang) setCurrentLang(lang);
    }

    // 2. Observer untuk menyembunyikan elemen UI Google tanpa menghapus DOM-nya
    const hideGoogleElements = () => {
      const selectors = [
        ".goog-te-banner-frame",
        ".goog-te-gadget-icon",
        ".goog-te-gadget-simple",
        ".goog-te-spinner-pos",
        ".goog-te-balloon-frame",
        "#goog-gt-tt",
        "#goog-gt-",
        "iframe[id*=':1.container']",
        "iframe[src*='translate.googleapis.com']",
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.setProperty("display", "none", "important");
          htmlEl.style.setProperty("visibility", "hidden", "important");
          htmlEl.style.setProperty("opacity", "0", "important");
          htmlEl.style.setProperty("pointer-events", "none", "important");
        });
      });
    };

    const observer = new MutationObserver(() => {
      hideGoogleElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 3. Init Script Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "id",
          includedLanguages: "id,en,zh-CN,ja,ko,ar,nl,de,fr,es",
          autoDisplay: false,
        },
        "google_translate_element_hidden"
      );
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setIsOpen(!isOpen);
  };

  const clearGoogleTranslateCookies = () => {
    const domain = window.location.hostname;
    const hostParts = domain.split(".");

    const domainsToClear = [
      "",
      domain,
      `.${domain}`,
      hostParts.length > 2 ? `.${hostParts.slice(-2).join(".")}` : "",
    ];

    const pathsToClear = ["/", "/id", "/en"];

    domainsToClear.forEach((d) => {
      pathsToClear.forEach((p) => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}; ${d ? `domain=${d};` : ""}`;
        document.cookie = `googtrans=; path=${p}; ${d ? `domain=${d};` : ""} max-age=0;`;
      });
    });
  };

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    clearGoogleTranslateCookies();

    if (langCode !== "id") {
      const domain = window.location.hostname;
      const cookieValue = `/id/${langCode}`;

      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;
    }

    setCurrentLang(langCode);
    setIsOpen(false);

    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  const selectedLanguageLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.label || "Language";

  return (
    <>
      <style jsx global>{`
        /* Sembunyikan elemen visual Google Translate */
        .goog-te-banner-frame,
        .goog-te-banner,
        .goog-te-gadget-icon,
        .goog-te-gadget-simple,
        .goog-te-menu-value,
        .goog-te-spinner-pos,
        #goog-gt-tt,
        #goog-gt-,
        .goog-te-balloon-frame,
        .goog-tooltip,
        iframe[id*=":1.container"],
        iframe[src*="translate.googleapis.com"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        body {
          top: 0px !important;
          position: static !important;
        }

        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }

        #google_translate_element_hidden {
          display: none !important;
        }

        @keyframes dropdownEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-dropdown-enter {
          animation: dropdownEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top left;
        }
      `}</style>

      <div id="google_translate_element_hidden" className="hidden" />

      {/* Button Trigger Header - Fixed Size & Unified Styling */}
      <button
        ref={buttonRef}
        type="button"
        disabled={isLoading}
        onClick={handleToggle}
        className="flex h-10 w-36 sm:w-44 items-center justify-between rounded-full border border-clay-950/15 bg-white/90 px-3.5 py-2 text-xs font-medium text-clay-900 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-terracotta-600 hover:bg-white active:scale-95 disabled:opacity-80"
      >
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <Globe size={15} className="text-clay-700 shrink-0" />
          <span className="truncate">{selectedLanguageLabel}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-clay-500 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Menu Dropdown dengan Animasi Smooth */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[99998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="animate-dropdown-enter fixed w-56 rounded-2xl border border-clay-950/10 bg-white/95 p-1.5 shadow-xl backdrop-blur-md z-[99999] max-h-72 overflow-y-auto"
          >
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors duration-150 ${
                    isSelected
                      ? "bg-terracotta-600/10 font-semibold text-terracotta-700"
                      : "text-clay-800 hover:bg-cream-100/80 hover:text-clay-950"
                  }`}
                >
                  <span className="truncate pr-2">{lang.label}</span>
                  {isSelected && (
                    <Check size={14} className="text-terracotta-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Floating Loading Screen dengan Logo */}
      {isLoading && (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="relative h-12 w-12 animate-spin">
            <Image
              src="/images/logo.png"
              alt="Translating..."
              fill
              className="object-contain"
            />
          </div>
          <span className="mt-3 text-xs font-semibold text-clay-900 tracking-wide animate-pulse">
            Translating...
          </span>
        </div>
      )}
    </>
  );
}