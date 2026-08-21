import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gajah Mada Export",
  description: "Handwoven rattan furniture, exported worldwide from Cirebon, Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
