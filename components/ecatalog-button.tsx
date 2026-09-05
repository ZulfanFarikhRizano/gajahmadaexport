"use client";

import { Eye } from "lucide-react"; // Mengganti ikon Download menjadi Eye (opsional, agar sesuai dengan konteks melihat PDF)

export function ECatalogButton({ href }: { href: string }) {
  const state1 = "Lihat E-Catalog";
  const state2 = "Buka PDF";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ecat-button"
    >
      <span className="ecat-bg" aria-hidden="true" />
      <svg aria-hidden="true" viewBox="0 0 342 208" className="ecat-splash" fill="none">
        <path strokeLinecap="round" strokeWidth={3} stroke="currentColor" d="M54.1054 99.7837C54.1054 99.7837 40.0984 90.7874 26.6893 97.6362C13.2802 104.485 1.5 97.6362 1.5 97.6362" />
        <path strokeLinecap="round" strokeWidth={3} stroke="currentColor" d="M285.273 99.7841C285.273 99.7841 299.28 90.7879 312.689 97.6367C326.098 104.486 340.105 95.4893 340.105 95.4893" />
        <path strokeLinecap="round" strokeWidth={3} strokeOpacity="0.3" stroke="currentColor" d="M281.133 64.9917C281.133 64.9917 287.96 49.8089 302.934 48.2295C317.908 46.6501 319.712 36.5272 319.712 36.5272" />
        <path strokeLinecap="round" strokeWidth={3} strokeOpacity="0.3" stroke="currentColor" d="M281.133 138.984C281.133 138.984 287.96 154.167 302.934 155.746C317.908 157.326 319.712 167.449 319.712 167.449" />
      </svg>
      <span className="ecat-outline" aria-hidden="true" />
      <span className="ecat-wrap">
        <span className="ecat-label-stack">
          <span className="ecat-char state-1">
            {state1.split("").map((c, i) => (
              <span key={i} style={{ ["--i" as string]: i + 1 }}>{c === " " ? "\u00A0" : c}</span>
            ))}
          </span>
          <span className="ecat-char state-2">
            {state2.split("").map((c, i) => (
              <span key={i} style={{ ["--i" as string]: i + 1 }}>{c === " " ? "\u00A0" : c}</span>
            ))}
          </span>
        </span>
        <span className="ecat-icon">
          <Eye size={18} />
        </span>
      </span>
    </a>
  );
}