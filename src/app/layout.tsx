import type { Metadata } from "next";
import { Geist, Geist_Mono, Bitter } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nora | Homemade Snacks & Culinary Powders",
  description: "Authentic homemade goodness. Shop our collection of spice mixes, health powders, and traditional snacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bitter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
