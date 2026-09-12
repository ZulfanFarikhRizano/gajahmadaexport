"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught server error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-2xl bg-white p-8 border border-clay-200 shadow-sm max-w-md w-full">
        <h2 className="font-display text-xl font-semibold text-clay-950">
          Koneksi Terganggu
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-clay-600 leading-relaxed">
          Gagal mengambil data dari server. Silakan coba muat ulang halaman.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#b3593b] text-white text-xs font-medium shadow-md hover:bg-[#9a4b31] active:scale-95 transition-all"
          >
            Coba Lagi
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl border border-clay-300 bg-white text-clay-800 text-xs font-medium hover:bg-clay-50 active:scale-95 transition-all"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    </div>
  );
}