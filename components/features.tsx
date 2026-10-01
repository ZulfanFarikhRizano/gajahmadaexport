"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Volume2, VolumeX } from "lucide-react"; // Pastikan lucide-react terinstall, atau sesuaikan ikonnya

const processSteps = [
  {
    index: "01",
    title: "Sourcing the Rattan",
    description:
      "Kami memilih batang rotan matang dari hutan yang dikelola berkelanjutan di Kalimantan, dipilih karena kekuatan dan kelenturannya.",
  },
  {
    index: "02",
    title: "Hand-Woven by Artisans",
    description:
      "Setiap produk melewati tangan pengrajin Cirebon, menenun motif yang diwariskan turun-temurun.",
  },
  {
    index: "03",
    title: "Finishing & Detailing",
    description:
      "Rangka diamplas, dilapis, dan diberi pewarna alami yang melindungi serat sambil menjaga kehangatan warnanya.",
  },
  {
    index: "04",
    title: "Packed for Export",
    description:
      "Setiap pesanan dikemas sesuai standar pengiriman internasional, siap dari workshop kami ke tempat Anda.",
  },
];

export default function Features() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideoInView = useInView(videoRef, { amount: 0.3 });
  
  // State untuk mengontrol suara
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoInView]);

  // Handler untuk toggle suara
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="process" className="relative py-24 bg-clay-950 text-cream-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        
        {/* Container Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative w-full mb-16 overflow-hidden rounded-2xl border border-brass-400/20 bg-black shadow-2xl group"
        >
          <video
            ref={videoRef}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className="w-full h-auto object-contain max-h-[80vh] block"
          >
            <source src="/video/video-gajahmada-2.mp4" type="video/mp4" />
            Browser Anda tidak mendukung pemutaran video HTML5.
          </video>

          {/* Tombol Control Suara (Mute / Unmute) */}
          <button
            onClick={toggleMute}
            type="button"
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-clay-950/80 backdrop-blur-md border border-brass-400/40 text-cream-50 hover:bg-brass-400 hover:text-clay-950 transition-all duration-300 text-xs"
            aria-label={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-brass-400 group-hover:text-clay-950" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-brass-400 group-hover:text-clay-950" />
                <span>Mute</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-brass-400 mb-3">
            From Forest to Freight
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium">
            The journey of every piece we export.
          </h2>
        </motion.div>

        {/* Process Steps */}
        <div className="relative grid md:grid-cols-4 gap-10 md:gap-6">
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-brass-400/30" />

          {processSteps.map((step, i) => (
            <motion.div
              key={step.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 w-12 h-12 rounded-full bg-clay-950 border border-brass-400/60 flex items-center justify-center font-display text-brass-400 text-sm mb-6">
                {step.index}
              </div>
              <h3 className="font-display text-lg mb-2 text-cream-50">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream-100/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}