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

  // Memastikan video langsung play begitu komponen dirender di DOM
  useEffect(() => {
    if (visible && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay terhalang, mencoba play dalam mode muted:", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setMuted(true);
            videoRef.current.play().catch((e) => console.error("Gagal pemutaran:", e));
          }
        });
      }
    }
  }, [visible]);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuteState = !videoRef.current.muted;
      videoRef.current.muted = nextMuteState;
      setMuted(nextMuteState);
    }
  };

  const close = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={close}
            onError={(e) => {
              console.error("Gagal memuat video:", src, e);
              close();
            }}
            className="h-full w-full object-cover"
          />

          <button
            onClick={close}
            type="button"
            className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20 z-[10000]"
          >
            Lewati <X size={16} />
          </button>

          <button
            onClick={toggleMute}
            type="button"
            aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
            className="absolute bottom-5 right-5 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/20 z-[10000]"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}