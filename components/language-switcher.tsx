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
    // Muat script Google Translate di background
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "id", autoDisplay: false },
          "google_translate_element_hidden"
        );
      };
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    // Set cookie terjemahan Google
    document.cookie = `googtrans=/id/${langCode}; path=/;`;
    document.cookie = `googtrans=/id/${langCode}; domain=.${window.location.hostname}; path=/;`;
    
    // Refresh halaman agar terjemahan langsung diterapkan secara konsisten
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left z-50">
      {/* Hidden Div untuk memicu engine Google */}
      <div id="google_translate_element_hidden" className="hidden" />

      {/* Tombol Pemicu Custom */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-clay-950/20 bg-white/90 px-3 py-1.5 text-xs font-medium text-clay-800 shadow-sm hover:border-terracotta-600 transition-all"
      >
        <Globe size={15} className="text-clay-700 shrink-0" />
        <span>{LANGUAGES.find((l) => l.code === currentLang)?.label || "Language"}</span>
      </button>

      {/* Popover Menu Dropdown */}
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