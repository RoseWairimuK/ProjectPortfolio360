/**
 * Sidebar.tsx
 *
 * Responsive sidebar navigation with forest-green branding.
 * Desktop: fixed left sidebar always visible.
 * Mobile: hidden by default, slides in via hamburger menu.
 * Safari-safe: uses -webkit-overflow-scrolling and transform for smooth behaviour.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  PieChart,
  Info,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCompanies, Company } from "@/data";

/** RAG status dot colour for company list */
function statusDot(status: string) {
  switch (status) {
    case "healthy":
      return "bg-emerald-400";
    case "watch":
      return "bg-amber-400";
    case "critical":
      return "bg-red-400";
    default:
      return "bg-slate-400";
  }
}

const navItems = [
  { href: "/about", label: "About", icon: Info },
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts & Warnings", icon: AlertTriangle },
  { href: "/allocation", label: "Portfolio Allocation", icon: PieChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const companies = getCompanies();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-[#0a5c14] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              PortfolioView360
            </h1>
            <p className="text-xs text-[#9aaa8e] uppercase tracking-widest">
              Analytics Platform
            </p>
            <p className="text-xs font-semibold text-white mt-0.5">
              Demo built by Rosemary Kanyoro
            </p>
          </div>
        </Link>
        {/* Close button - mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-white/70 hover:text-white p-1"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 py-4">
        <p className="px-2 mb-2 text-[10px] font-medium text-white/60 uppercase tracking-widest">
          Overview
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-[#E8922D]/10 text-[#F5A623] font-medium"
                  : "text-white/75 hover:text-white hover:bg-[#0a5c14]/60"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Companies List */}
      <div
        className="px-3 py-2 flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <p className="px-2 mb-2 text-[10px] font-medium text-white/60 uppercase tracking-widest">
          Companies ({companies.length})
        </p>
        {companies.map((company: Company) => {
          const href = `/company/${company.id}`;
          const isActive = pathname === href;

          return (
            <Link
              key={company.id}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors mb-0.5 group",
                isActive
                  ? "bg-[#0a5c14] text-white"
                  : "text-white/75 hover:text-white hover:bg-[#0a5c14]/50"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full flex-shrink-0",
                  statusDot(company.status)
                )}
              />
              <span className="truncate flex-1 text-xs">{company.name}</span>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#0a5c14]">
        <p className="text-[10px] text-white/50">
          PortfolioView360 - Simulated Data
        </p>
        <p className="text-[10px] text-white/50">
          Demo built by Rosemary Kanyoro
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#03440c] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white p-1"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-white">PortfolioView360</span>
      </div>

      {/* Backdrop overlay - mobile only */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-64 bg-[#03440c] border-r border-[#0a5c14] flex flex-col z-50",
          "transition-transform duration-300 ease-in-out",
          // Desktop: always visible. Mobile: slide in/out.
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
