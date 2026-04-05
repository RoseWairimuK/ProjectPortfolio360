/**
 * KpiCard.tsx
 *
 * Reusable KPI card component for displaying a single metric
 * with its value, trend indicator, and optional sparkline.
 *
 * Used on the command center, company pages, and allocation views.
 */

"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;        // e.g. "+12.3%"
    isGood: boolean;      // is this direction positive for this metric?
  };
  icon?: React.ReactNode;
  className?: string;
}

export default function KpiCard({
  label,
  value,
  subtext,
  trend,
  icon,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "card card-hover flex flex-col justify-between min-h-[110px]",
        className
      )}
    >
      {/* Header: label + icon */}
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-[#7a8a6e] uppercase tracking-wider">
          {label}
        </p>
        {icon && <div className="text-[#5D7A3E]">{icon}</div>}
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold text-white tracking-tight">
        {value}
      </p>

      {/* Trend + subtext */}
      <div className="flex items-center gap-2 mt-1.5">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
              trend.isGood
                ? "text-emerald-400 bg-emerald-400/10"
                : trend.direction === "flat"
                  ? "text-slate-400 bg-slate-400/10"
                  : "text-red-400 bg-red-400/10"
            )}
          >
            {trend.direction === "up" && <TrendingUp className="w-3 h-3" />}
            {trend.direction === "down" && <TrendingDown className="w-3 h-3" />}
            {trend.direction === "flat" && <Minus className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
        {subtext && (
          <span className="text-xs text-slate-500">{subtext}</span>
        )}
      </div>
    </div>
  );
}
