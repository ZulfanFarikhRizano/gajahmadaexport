"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full border border-clay-950/15 bg-white/90 shadow-sm" />;
  }

  const isDark = theme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = isDark ? "light" : "dark";

    // Cek apakah browser mendukung View Transitions API & tidak diset reduce-motion
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    // Ambil posisi koordinat klik tombol untuk pusat lingkaran reveal
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Hitung radius maksimal ke sudut layar terjauh
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Jalankan View Transition
    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      // Animasikan elemen pseudo view-transition-new
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-clay-950/15 bg-white/90 text-clay-900 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-terracotta-600 hover:bg-white active:scale-95 dark:border-white/20 dark:bg-clay-950/90 dark:text-cream-50 dark:hover:border-terracotta-500"
    >
      {isDark ? (
        <Sun size={16} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={16} className="text-clay-700 transition-transform duration-300 rotate-0 hover:-rotate-12 dark:text-cream-50" />
      )}
    </button>
  );
}