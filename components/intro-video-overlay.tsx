"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

interface IntroVideoOverlayProps {
  src: string;
  poster?: string;
}

export function IntroVideoOverlay({ src, poster }: IntroVideoOverlayProps) {
  const [visible, setVisible] = useState(true); // Paksa true
  const videoRef = useRef<HTMLVideoElement>(null);

  // Paksa play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Play failed", e));
    }
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        loop
        className="w-full h-full object-cover"
      />

      <button
        onClick={() => setVisible(false)}
        className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20"
      >
        Tutup Paksa <X size={16} />
      </button>
    </motion.div>
  );
}