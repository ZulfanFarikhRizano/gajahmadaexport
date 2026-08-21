"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const ease = [0.22, 1, 0.36, 1] as const;

interface MenuItem {
  label: string;
  href: string;
}

interface FloatingMenuProps {
  items?: MenuItem[];
}

function MenuButton({
  label,
  onClick,
  isOpen,
  index,
}: {
  label: string;
  onClick?: () => void;
  isOpen: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const animatingRef = useRef(false);
  const pendingLeaveRef = useRef(false);
  const chars = label.split("");
  const lockDuration = 30 * chars.length + 300;

  const handleEnter = useCallback(() => {
    pendingLeaveRef.current = false;
    if (hovered) return;
    setHovered(true);
    animatingRef.current = true;
    setTimeout(() => {
      animatingRef.current = false;
      if (pendingLeaveRef.current) {
        pendingLeaveRef.current = false;
        setHovered(false);
      }
    }, lockDuration);
  }, [hovered, lockDuration]);

  const handleLeave = useCallback(() => {
    if (animatingRef.current) {
      pendingLeaveRef.current = true;
    } else {
      setHovered(false);
    }
  }, []);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="text-[#FAF6EE] text-[20px] uppercase leading-none overflow-hidden"
      style={{
        fontFamily: "'Trobika', 'Bebas Neue', sans-serif",
        letterSpacing: "-0.03em",
        height: "1em",
      }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{
        duration: 0.4,
        delay: isOpen ? 0.35 + 0.08 * index : 0,
        ease,
      }}
    >
      <div className="flex justify-center">
        {chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden" style={{ height: "1em" }}>
            <span
              className="flex flex-col"
              style={{
                transitionProperty: "transform",
                transitionDuration: hovered ? "800ms" : "0ms",
                transitionDelay: hovered ? `${30 * i}ms` : "0ms",
                transform: hovered ? "translateY(-50%)" : "translateY(0%)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <span className="block" style={{ height: "1em", lineHeight: "1em" }}>{char}</span>
              <span className="block" style={{ height: "1em", lineHeight: "1em" }} aria-hidden>{char}</span>
            </span>
          </span>
        ))}
      </div>
    </motion.button>
  );
}

export default function FloatingMenu({ items }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const menuItems: MenuItem[] = items ?? [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    // Footprint tetap 150x48 (ukuran pill saat tertutup) supaya header tidak
    // "lompat" — panel yang membesar ada di dalam, posisinya absolute.
    <div ref={containerRef} className="relative z-[100]" style={{ width: 150, height: 48 }}>
      <motion.div
        className="absolute right-0 top-0 overflow-hidden flex flex-col"
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        style={{
          fontFamily: "'Aeonik TRIAL', 'Inter', sans-serif",
          letterSpacing: "-0.02em",
          cursor: isOpen ? "default" : "pointer",
        }}
        animate={{
          width: isOpen ? 280 : 150,
          height: isOpen ? 260 : 48,
          borderRadius: isOpen ? 32 : 72,
        }}
        whileHover={isOpen ? undefined : { scale: 1.05 }}
        transition={{
          duration: 0.8,
          ease,
          height: { duration: isOpen ? 0.8 : 0.15 },
          scale: { duration: 0.25, ease },
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: "#B8935A", borderColor: "#9C7A3F" }}
          transition={{ duration: isOpen ? 0.1 : 0.3, ease }}
          style={{ borderWidth: 1, borderStyle: "solid", borderRadius: "inherit" }}
        />

        {/* Lingkaran gelap sekarang mekar dari ATAS, karena panel buka ke bawah */}
        <motion.div
          className="absolute left-1/2 bg-clay-950"
          style={{ width: "200%", height: "200%", borderRadius: "50%", x: "-50%" }}
          animate={{ top: isOpen ? "-20%" : "-200%" }}
          transition={{ duration: 0.8, ease, delay: isOpen ? 0.1 : 0 }}
        />

        {/* Bar "Menu" + hamburger — dirender PERTAMA supaya selalu di atas */}
        <motion.div
          className="relative z-10 flex items-center justify-between w-full shrink-0 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          animate={{
            paddingLeft: isOpen ? 24 : 20,
            paddingRight: isOpen ? 24 : 20,
            paddingTop: isOpen ? 24 : 0,
            height: 48,
          }}
          transition={{ duration: 0.8, ease }}
          style={{ alignItems: "center" }}
        >
          <motion.span
            className="text-[14px] leading-none"
            animate={{ color: isOpen ? "#FAF6EE" : "#2E2018" }}
            transition={{ duration: 0.3, ease }}
          >
            Menu
          </motion.span>

          <div className="relative w-[24px] h-[24px] flex items-center justify-center">
            <motion.span
              className="absolute block w-[18px] h-[2px] rounded-full"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -3, backgroundColor: isOpen ? "#FAF6EE" : "#2E2018" }}
              transition={{ duration: 0.4, ease }}
            />
            <motion.span
              className="absolute block w-[18px] h-[2px] rounded-full"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 3, backgroundColor: isOpen ? "#FAF6EE" : "#2E2018" }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
        </motion.div>

        {/* Item menu — dirender SETELAH bar, jadi tampil di bawahnya */}
        <div
          className="relative z-10 flex flex-col gap-5 items-center justify-center"
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            opacity: isOpen ? 1 : 0,
            flex: isOpen ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {menuItems.map((item, idx) => (
            <MenuButton
              key={item.label}
              label={item.label}
              onClick={() => {
                router.push(item.href);
                setIsOpen(false);
              }}
              isOpen={isOpen}
              index={idx}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}