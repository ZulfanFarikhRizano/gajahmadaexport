"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const googtrans = cookies.find((row) => row.startsWith("googtrans="));
    if (googtrans) {
      const val = googtrans.split("=")[1];
      const lang = val?.split("/").pop();
      if (lang) setCurrentLang(lang);
    }

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "id", autoDisplay: false },
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
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLang) {
      setIsOpen(false);
      return;
    }

    const domain = window.location.hostname;

    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;

    if (langCode !== "id") {
      document.cookie = `googtrans=/id/${langCode}; path=/;`;
      document.cookie = `googtrans=/id/${langCode}; domain=.${domain}; path=/;`;
    }

    setCurrentLang(langCode);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative z-[9999] inline-block text-left">
      <div id="google_translate_element_hidden" className="hidden" />

      {/* Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-clay-950/20 bg-white/90 px-4 py-2 text-xs font-medium text-clay-900 shadow-sm transition-all duration-300 hover:border-terracotta-600 hover:bg-white active:scale-95"
      >
        <Globe size={15} className="text-clay-700 shrink-0" />
        <span>{LANGUAGES.find((l) => l.code === currentLang)?.label || "Language"}</span>
        <ChevronDown 
          size={14} 
          className={`text-clay-500 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Popover Dropdown dengan Animasi Smooth */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-52 origin-top-left rounded-2xl border border-clay-950/10 bg-white/95 p-2 shadow-xl backdrop-blur-md z-[9999] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
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
                  <span>{lang.label}</span>
                  {isSelected && <Check size={14} className="text-terracotta-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}