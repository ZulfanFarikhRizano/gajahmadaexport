"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

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

  useEffect(() => {
    // 1. Ambil bahasa tersimpan di cookie
    const cookies = document.cookie.split("; ");
    const googtrans = cookies.find((row) => row.startsWith("googtrans="));
    if (googtrans) {
      const val = googtrans.split("=")[1];
      const lang = val?.split("/").pop();
      if (lang) setCurrentLang(lang);
    }

    // 2. Setup Google Translate Engine
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value;
    const domain = window.location.hostname;

    // Bersihkan cookie lama
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;

    if (langCode !== "id") {
      // Pasang cookie terjemahan
      document.cookie = `googtrans=/id/${langCode}; path=/;`;
      document.cookie = `googtrans=/id/${langCode}; domain=.${domain}; path=/;`;
    }

    setCurrentLang(langCode);
    window.location.reload();
  };

  return (
    <div className="relative z-[9999] inline-flex items-center gap-2 rounded-full border border-clay-950/20 bg-white/90 px-3 py-1.5 shadow-sm transition-all hover:border-terracotta-600">
      <div id="google_translate_element_hidden" className="hidden" />
      <Globe size={15} className="text-clay-700 shrink-0 pointer-events-none" />
      
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        className="bg-transparent text-xs font-medium text-clay-800 outline-none cursor-pointer pr-1"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-clay-900">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}