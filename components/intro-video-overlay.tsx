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
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    const conn = (navigator as any).connection;
    const isSlow =
      conn && (conn.saveData || ["slow-2g", "2g", "3g"].includes(conn.effectiveType));

    if (!isSlow) {
      setVisible(true);
      if (process.env.NODE_ENV === "production") {
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    }
  }, []);

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch((e) => console.error("Autoplay error:", e));
    }
  }, [visible]);

  // Fungsi untuk menyalakan suara via gestur klik pengguna
  const handleEnableAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setMuted(false);
      setShowUnmuteHint(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Biar tidak bentrok dengan handler overlay
    if (videoRef.current) {
      const nextMuteState = !videoRef.current.muted;
      videoRef.current.muted = nextMuteState;
      setMuted(nextMuteState);
      if (showUnmuteHint) setShowUnmuteHint(false);
    }
  };

  const close = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={handleEnableAudio}
          className="fixed inset-0 z-[9999] bg-black cursor-pointer select-none"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={() => setVisible(false)}
            onError={(e) => {
              console.error("Gagal memuat video:", src, e);
              setVisible(false);
            }}
            className="h-full w-full object-cover pointer-events-none"
          />

          {/* Tombol Lewati */}
          <button
            onClick={close}
            type="button"
            className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-black/40 border border-white/20 px-4 py-2 text-sm text-white backdrop-blur-md hover:bg-black/60 z-[10000]"
          >
            Lewati <X size={16} />
          </button>

          {/* Petunjuk Klik untuk Aktifkan Suara */}
          <AnimatePresence>
            {showUnmuteHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-[9999]"
              >
                <div className="flex items-center gap-2 rounded-full bg-black/60 border border-white/20 px-5 py-2.5 text-sm text-white backdrop-blur-md shadow-2xl animate-pulse">
                  <VolumeX size={18} className="text-amber-400" />
                  <span>Ketuk di mana saja untuk menyalakan suara</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombol Mute / Unmute Manual */}
          <button
            onClick={toggleMute}
            type="button"
            aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
            className="absolute bottom-5 right-5 rounded-full bg-black/40 border border-white/20 p-3 text-white backdrop-blur-md hover:bg-black/60 z-[10000]"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}