"use client";

import { useEffect, useState } from "react";
import { Globe, Check } from "lucide-react";

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

  useEffect(() => {
    // 1. Baca bahasa aktif dari cookie
    const cookies = document.cookie.split("; ");
    const googtransCookie = cookies.find((row) => row.startsWith("googtrans="));
    if (googtransCookie) {
      const val = googtransCookie.split("=")[1];
      const lang = val?.split("/").pop();
      if (lang) setCurrentLang(lang);
    }

    // 2. Pasang callback window SEBELUM skrip di-inject
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "id", autoDisplay: false },
        "google_translate_element_hidden"
      );
    };

    // 3. Inject Script Google Translate jika belum ada
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    // Domain Hostname
    const domain = window.location.hostname;

    // Bersihkan cookie googtrans lama secara menyeluruh untuk cegah infinite loading
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;

    if (langCode !== "id") {
      // Set cookie baru
      document.cookie = `googtrans=/id/${langCode}; path=/;`;
      document.cookie = `googtrans=/id/${langCode}; domain=.${domain}; path=/;`;
    }

    setCurrentLang(langCode);
    setIsOpen(false);

    // Refresh halaman agar bahasa baru terdistribusi bersih
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left z-50">
      {/* Container tersembunyi untuk Google Translate Engine */}
      <div id="google_translate_element_hidden" className="hidden" />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-clay-950/20 bg-white/90 px-3 py-1.5 text-xs font-medium text-clay-800 shadow-sm hover:border-terracotta-600 transition-all"
      >
        <Globe size={15} className="text-clay-700 shrink-0" />
        <span>{LANGUAGES.find((l) => l.code === currentLang)?.label || "Language"}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-clay-950/10 z-50 max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                  currentLang === lang.code
                    ? "bg-terracotta-600/10 font-semibold text-terracotta-600"
                    : "text-clay-800 hover:bg-clay-950/5"
                }`}
              >
                <span>{lang.label}</span>
                {currentLang === lang.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}