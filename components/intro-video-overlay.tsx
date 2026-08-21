"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Volume2, VolumeX, X } from "lucide-react";

const SESSION_KEY = "gm_intro_played";

interface IntroVideoOverlayProps {
  src: string;
  poster?: string;
}

export function IntroVideoOverlay({ src, poster }: IntroVideoOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Muncul sekali per sesi tab browser. Ganti sessionStorage -> localStorage
    // di 2 baris di bawah kalau maunya cuma sekali seumur hidup per perangkat.
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Lewati otomatis kalau koneksi lambat / mode hemat data aktif —
    // jangan paksa unduh video di jaringan yang sudah pas-pasan.
    const conn = (navigator as any).connection;
    const isSlow =
      conn && (conn.saveData || ["slow-2g", "2g", "3g"].includes(conn.effectiveType));

    sessionStorage.setItem(SESSION_KEY, "1");
    if (!isSlow) setVisible(true);
  }, []);

  const close = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[300] bg-black"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted={muted}
            playsInline
            onEnded={close}
            onError={close}
            className="h-full w-full object-cover"
          />

          <button
            onClick={close}
            className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20"
          >
            Lewati <X size={16} />
          </button>

          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
            className="absolute bottom-5 right-5 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}