import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // <-- Tambahkan ini untuk mengaktifkan class strategy
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          950: "#2E2018",
          800: "#4A3325",
          600: "#6B4A34",
        },
        terracotta: {
          600: "#A85C3F",
          500: "#C17A52",
          200: "#E8C9AE",
        },
        plum: {
          700: "#432B44",
          600: "#5B3A5C",
          400: "#8A6690",
        },
        brass: {
          500: "#9C7A3F",
          400: "#B8935A",
          200: "#E4D2AA",
        },
        cream: {
          50: "#FAF6EE",
          100: "#F3EBDA",
        },
        // Aliases shadcn-style
        background: "#FAF6EE",
        foreground: "#2E2018",
        muted: "#F3EBDA",
        "muted-foreground": "#6B4A34",
        ring: "#A85C3F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 40px -12px rgba(46, 32, 24, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;