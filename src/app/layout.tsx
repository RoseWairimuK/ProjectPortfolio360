/**
 * Root layout for Portfolio360.
 *
 * Sets up the global font, dark background, and shared navigation sidebar.
 * All pages render inside this shell.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Portfolio360 — Portfolio Analytics",
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
      <body className="min-h-full flex bg-[#0c120c] text-slate-200">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 ml-64 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
