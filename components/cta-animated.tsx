"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function CtaAnimated({ waNumber }: { waNumber: string }) {
  return (
    <section id="contact" className="relative py-28 bg-terracotta-600 overflow-hidden">
      <div className="ornament-corner absolute -top-16 right-0 w-72 h-72 opacity-20 invert" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl px-6 text-center text-cream-50"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-cream-100/80 mb-4">
          Siap melengkapi ruang Anda
        </p>
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
          whileHover="hover"
          className="group relative inline-flex items-center gap-2 rounded-full bg-cream-50 text-clay-950 px-7 py-3.5 font-medium overflow-hidden"
        >
          <span className="relative z-10">Chat via WhatsApp</span>
          <motion.span
            variants={{ hover: { x: 3, y: -3 } }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10"
          >
            <ArrowUpRight size={18} />
          </motion.span>
          <motion.span
            variants={{ hover: { scaleX: 1 } }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ originX: 0 }}
            className="absolute bottom-0 left-0 right-0 h-full bg-brass-200/60 -z-0"
          />
        </motion.a>
      </motion.div>
    </section>
  );
}
