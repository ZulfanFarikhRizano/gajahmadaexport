"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Volume2, VolumeX, X } from "lucide-react";

const SESSION_KEY = "gm_intro_played";

interface IntroVideoOverlayProps {
  srcLandscape: string; // URL video untuk Desktop / Laptop
  srcPortrait: string;  // URL video untuk Mobile / Smartphone
  posterLandscape?: string;
  posterPortrait?: string;
}

export function IntroVideoOverlay({
  srcLandscape,
  srcPortrait,
  posterLandscape,
  posterPortrait,
}: IntroVideoOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);

  // Ref terpisah untuk masing-masing video
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

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

  // Play kedua video agar siap digunakan saat resize layar
  useEffect(() => {
    if (visible) {
      desktopVideoRef.current?.play().catch(() => {});
      mobileVideoRef.current?.play().catch(() => {});
    }
  }, [visible]);

  // Fungsi Unmute saat layar ditap/diklik
  const handleEnableAudio = () => {
    if (desktopVideoRef.current) desktopVideoRef.current.muted = false;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = false;
    setMuted(false);
    setShowUnmuteHint(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuteState = !muted;
    if (desktopVideoRef.current) desktopVideoRef.current.muted = nextMuteState;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = nextMuteState;
    setMuted(nextMuteState);
    if (showUnmuteHint) setShowUnmuteHint(false);
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
          {/* Video Desktop (Landscape) - Tampil di layar md (768px) ke atas */}
          <video
            ref={desktopVideoRef}
            src={srcLandscape}
            poster={posterLandscape}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={() => setVisible(false)}
            onError={() => setVisible(false)}
            className="hidden md:block h-full w-full object-cover pointer-events-none"
          />

          {/* Video Mobile (Portrait) - Tampil di bawah layar md (<768px) */}
          <video
            ref={mobileVideoRef}
            src={srcPortrait}
            poster={posterPortrait}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={() => setVisible(false)}
            onError={() => setVisible(false)}
            className="block md:hidden h-full w-full object-cover pointer-events-none"
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