/**
 * MiniChart.tsx
 *
 * Small inline sparkline/area chart component.
 * Used in the portfolio table and KPI cards to show trends at a glance
 * without needing a full chart view.
 */

"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";

interface MiniChartProps {
  data: { value: number; label?: string }[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
}

export default function MiniChart({
  data,
  color = "#3b82f6",
  height = 40,
  showTooltip = false,
}: MiniChartProps) {
  // Determine if trend is positive (last > first) for colour hint
  const isPositive =
    data.length > 1 && data[data.length - 1].value >= data[0].value;
  /* Auto-colour: green for positive trend, red for negative — uses brand green */
  const chartColor = color === "auto" ? (isPositive ? "#7D9A3E" : "#ef4444") : color;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`gradient-${chartColor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#e2e8f0",
              }}
              formatter={(val) => [`$${Number(val).toLocaleString()}`, ""]}
              labelFormatter={(label) => String(label)}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={1.5}
            fill={`url(#gradient-${chartColor})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
