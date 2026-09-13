"use client";

import { useEffect } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl border border-clay-200 p-8 shadow-lg text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-medium text-clay-950 mb-2">
          Koneksi Terganggu
        </h2>

        <p className="text-xs text-clay-600 mb-6 leading-relaxed">
          Server membutuhkan waktu terlalu lama untuk merespons. Silakan coba muat ulang halaman.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#b3593b] text-white text-xs font-semibold rounded-xl hover:bg-[#96472e] active:scale-95 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}