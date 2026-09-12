"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function CtaAnimated({ waNumber }: { waNumber: string }) {
  return (
    <section id="contact" className="relative py-28 bg-terracotta-600 overflow-hidden">
      {/* Ornamen Etnik Berputar Lambat */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="ornament-corner absolute -top-16 right-0 w-72 h-72 opacity-20 invert pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-3xl px-6 text-center text-cream-50"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1 }}
          className="text-xs uppercase text-cream-100/80 mb-4 font-medium"
        >
          Siap melengkapi ruang Anda
        </motion.p>

        <h2 className="font-display text-3xl md:text-5xl font-medium leading-tight mb-5">
          Hadirkan kerajinan Gajah Mada ke ruang Anda.
        </h2>

        <p className="text-cream-100/85 mb-10 max-w-lg mx-auto">
          Dari satu kursi gantung hingga pesanan satu kontainer — tim kami membalas
          dalam satu hari kerja.
        </p>

        <motion.a
          href={buildGeneralWhatsAppLink(waNumber)}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group relative inline-flex items-center gap-2.5 rounded-full bg-cream-50 text-clay-950 px-8 py-4 font-medium overflow-hidden shadow-xl transition-shadow duration-300 hover:shadow-2xl"
        >
          <span className="relative z-10 font-semibold tracking-wide">
            Chat via WhatsApp
          </span>
          <motion.span
            className="relative z-10"
            variants={{
              initial: { x: 0, y: 0 },
              hover: { x: 3, y: -3 },
            }}
            initial="initial"
            whileHover="hover"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ArrowUpRight size={18} />
          </motion.span>
          <motion.span
            variants={{
              initial: { scaleX: 0 },
              hover: { scaleX: 1 },
            }}
            initial="initial"
            whileHover="hover"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="absolute bottom-0 left-0 right-0 h-full bg-brass-200/60 -z-0"
          />
        </motion.a>
      </motion.div>
    </section>
  );
}