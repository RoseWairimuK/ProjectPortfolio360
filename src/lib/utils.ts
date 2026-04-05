/**
 * utils.ts
 *
 * Shared utility functions for formatting numbers, dates,
 * and other display logic used across the site.
 */

import { clsx, type ClassValue } from "clsx";

/** Merge Tailwind classes safely (handles conflicts) */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format number as USD currency */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a number as percentage (input: 0.85 → "85.0%") */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format a number with commas */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format period string for display: "2024-01" → "Jan 2024" */
export function formatPeriod(period: string): string {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (period.startsWith("Q")) {
    return period; // Already formatted like "Q1-2024"
  }
  const [year, month] = period.split("-");
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

/** Get status colour classes */
export function statusColor(status: "healthy" | "watch" | "critical"): string {
  switch (status) {
    case "healthy":
      return "text-emerald-400";
    case "watch":
      return "text-amber-400";
    case "critical":
      return "text-red-400";
  }
}

/** Get status background colour classes */
export function statusBg(status: "healthy" | "watch" | "critical"): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-400/10 border-emerald-400/30";
    case "watch":
      return "bg-amber-400/10 border-amber-400/30";
    case "critical":
      return "bg-red-400/10 border-red-400/30";
  }
}

/** Get severity colour classes for alerts */
export function severityColor(severity: "critical" | "watch" | "info"): string {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-400/10 border-red-400/30";
    case "watch":
      return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    case "info":
      return "text-blue-400 bg-blue-400/10 border-blue-400/30";
  }
}

/** Compute a simple trend arrow and direction */
export function trendIndicator(current: number, previous: number, higherIsBetter = true): {
  arrow: string;
  color: string;
  direction: "up" | "down" | "flat";
  pctChange: number;
} {
  if (previous === 0) return { arrow: "→", color: "text-slate-400", direction: "flat", pctChange: 0 };

  const pctChange = (current - previous) / Math.abs(previous);
  const isUp = pctChange > 0.01;
  const isDown = pctChange < -0.01;

  if (!isUp && !isDown) {
    return { arrow: "→", color: "text-slate-400", direction: "flat", pctChange };
  }

  const isGood = higherIsBetter ? isUp : isDown;

  return {
    arrow: isUp ? "↑" : "↓",
    color: isGood ? "text-emerald-400" : "text-red-400",
    direction: isUp ? "up" : "down",
    pctChange,
  };
}
