/**
 * MarginChart.tsx
 *
 * Dual-line chart showing gross margin (green) and EBITDA margin (orange) trends.
 * Uses brand palette: green for gross, orange for EBITDA.
 */

"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { MonthlyMetric } from "@/data";

interface MarginChartProps {
  data: MonthlyMetric[];
  height?: number;
}

export default function MarginChart({ data, height = 280 }: MarginChartProps) {
  const chartData = data.map((m) => ({
    period: m.period.slice(2),  // "24-01" format for compactness
    grossMargin: +(m.grossMargin * 100).toFixed(1),
    ebitdaMargin: +(m.ebitdaMargin * 100).toFixed(1),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Margin Evolution (%)
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="period"
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}%`}
          />
          {/* Zero reference line for breakeven */}
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e2e8f0",
            }}
            formatter={(val, name) => [
              `${Number(val).toFixed(1)}%`,
              name === "grossMargin" ? "Gross Margin" : "EBITDA Margin",
            ]}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
          <Line
            type="monotone"
            dataKey="grossMargin"
            name="Gross Margin"
            stroke="#7D9A3E"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="ebitdaMargin"
            name="EBITDA Margin"
            stroke="#F5A623"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
