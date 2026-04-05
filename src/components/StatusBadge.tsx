/**
 * StatusBadge.tsx
 *
 * Traffic-light status badge: Healthy (green), Watch (amber), Critical (red).
 * Used across the portfolio to give instant visual status at a glance.
 */

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "healthy" | "watch" | "critical";
  size?: "sm" | "md";
}

const statusConfig = {
  healthy: {
    label: "Healthy",
    classes: "status-healthy",
  },
  watch: {
    label: "Watch",
    classes: "status-watch",
  },
  critical: {
    label: "Critical",
    classes: "status-critical",
  },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.classes,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {/* Pulsing dot for critical */}
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "healthy" && "bg-emerald-400",
          status === "watch" && "bg-amber-400",
          status === "critical" && "bg-red-400 animate-pulse"
        )}
      />
      {config.label}
    </span>
  );
}
