import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Likhon AI — বাংলা AI লেখক",
  description: "Professional বাংলা কন্টেন্ট তৈরি করো AI দিয়ে। Caption, post, bio, quote — সব কিছু মুহূর্তেই।",
  keywords: ["বাংলা AI", "Bengali AI writer", "Bangla content generator", "likhon"],
  openGraph: {
    title: "Likhon AI",
    description: "AI দিয়ে professional বাংলা কন্টেন্ট",
    locale: "bn_BD",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
