/**
 * Root layout for PortfolioView360.
 *
 * Sets up the global font, dark background, and shared navigation sidebar.
 * All pages render inside this shell.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortfolioView360 - Portfolio Analytics",
  description:
    "A portfolio intelligence platform demonstrating investment-grade analytics across 10 emerging market companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-[#f5f6f8] text-slate-800">
        {/* Sidebar navigation — dark forest green */}
        <Sidebar />

        {/* Main content area — light/breathable background */}
        <main className="flex-1 md:ml-64 ml-0 min-h-screen bg-[#f5f6f8]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-8 pt-16 md:pt-8">
            {children}
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
