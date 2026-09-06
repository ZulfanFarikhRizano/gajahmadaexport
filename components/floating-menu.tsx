"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

interface MenuItem {
  label: string;
  href: string;
}

interface FloatingMenuProps {
  items?: MenuItem[];
}

function useResponsiveMenuSize(menuItemCount: number) {
  const [size, setSize] = useState({ closedW: 150, openW: 280, openH: 260 });

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const closedW = Math.round(Math.min(150, Math.max(92, vw * 0.34)));
      const openW = Math.round(Math.min(280, Math.max(200, vw * 0.62)));
      const openH = Math.round(Math.max(openW * (260 / 280), menuItemCount * 52 + 90));
      setSize({ closedW, openW, openH });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [menuItemCount]);

  return size;
}

function MenuButton({
  label,
  href,
  onClick,
  onMouseEnter,
  isOpen,
  index,
}: {
  label: string;
  href: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  isOpen: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const animatingRef = useRef(false);
  const pendingLeaveRef = useRef(false);
  const chars = label.split("");
  const lockDuration = 30 * chars.length + 300;

  const handleEnter = useCallback(() => {
    onMouseEnter?.();
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
  }, [hovered, lockDuration, onMouseEnter]);

  const handleLeave = useCallback(() => {
    if (animatingRef.current) {
      pendingLeaveRef.current = true;
    } else {
      setHovered(false);
    }
  }, []);

  return (
    <motion.div
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.4, delay: isOpen ? 0.35 + 0.08 * index : 0, ease }}
    >
      <Link
        href={href}
        prefetch={true}
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="block text-[#FAF6EE] text-[16px] sm:text-[20px] uppercase leading-none overflow-hidden"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif", letterSpacing: "normal", height: "1em" }}
      >
        <div className="flex justify-center items-center">
          {chars.map((char, i) => {
            const isSpace = char === " ";
            const displayChar = isSpace ? "\u00A0" : char;

            return (
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
                  <span className="block" style={{ height: "1em", lineHeight: "1em" }}>
                    {displayChar}
                  </span>
                  <span className="block" style={{ height: "1em", lineHeight: "1em" }} aria-hidden>
                    {displayChar}
                  </span>
                </span>
              </span>
            );
          })}
        </div>
      </Link>
    </motion.div>
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
    { label: "Custom Order", href: "/custom-order" },
    { label: "Contact Us", href: "/contact" },
  ];

  const { closedW, openW, openH } = useResponsiveMenuSize(menuItems.length);

  // Prefetch semua link ketika menu dibuka
  useEffect(() => {
    if (isOpen) {
      menuItems.forEach((item) => {
        router.prefetch(item.href);
      });
    }
  }, [isOpen, menuItems, router]);

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
    <div ref={containerRef} className="relative z-[100]" style={{ width: closedW, height: 44 }}>
      <motion.div
        className="absolute right-0 top-0 overflow-hidden flex flex-col"
        onClick={() => { if (!isOpen) setIsOpen(true); }}
        style={{ fontFamily: "'Aeonik TRIAL', 'Inter', sans-serif", letterSpacing: "-0.02em", cursor: isOpen ? "default" : "pointer" }}
        animate={{
          width: isOpen ? openW : closedW,
          height: isOpen ? openH : 44,
          borderRadius: isOpen ? 32 : 72,
        }}
        whileHover={isOpen ? undefined : { scale: 1.05 }}
        transition={{
          duration: 0.8, ease,
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

        <motion.div
          className="absolute left-1/2 bg-clay-950"
          style={{ width: "200%", height: "200%", borderRadius: "50%", x: "-50%" }}
          animate={{ top: isOpen ? "-20%" : "-200%" }}
          transition={{ duration: 0.8, ease, delay: isOpen ? 0.1 : 0 }}
        />

        <motion.div
          className="relative z-10 flex items-center justify-between w-full shrink-0 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          animate={{
            paddingLeft: isOpen ? 20 : 16,
            paddingRight: isOpen ? 20 : 16,
            paddingTop: isOpen ? 20 : 0,
            height: 44,
          }}
          transition={{ duration: 0.8, ease }}
          style={{ alignItems: "center" }}
        >
          <motion.span
            className="text-[12px] sm:text-[14px] leading-none"
            animate={{ color: isOpen ? "#FAF6EE" : "#2E2018" }}
            transition={{ duration: 0.3, ease }}
          >
            Menu
          </motion.span>

          <div className="relative w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] flex items-center justify-center">
            <motion.span
              className="absolute block w-[15px] sm:w-[16px] h-[2px] rounded-full"
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -3, backgroundColor: isOpen ? "#FAF6EE" : "#2E2018" }}
              transition={{ duration: 0.4, ease }}
            />
            <motion.span
              className="absolute block w-[15px] sm:w-[16px] h-[2px] rounded-full"
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 3, backgroundColor: isOpen ? "#FAF6EE" : "#2E2018" }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
        </motion.div>

        <div
          className="relative z-10 flex flex-col gap-4 sm:gap-5 items-center justify-center"
          style={{ pointerEvents: isOpen ? "auto" : "none", opacity: isOpen ? 1 : 0, flex: isOpen ? 1 : 0, overflow: "hidden" }}
        >
          {menuItems.map((item, idx) => (
            <MenuButton
              key={item.label}
              label={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              onMouseEnter={() => router.prefetch(item.href)}
              isOpen={isOpen}
              index={idx}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}