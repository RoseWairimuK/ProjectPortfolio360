/**
 * CashRunwayChart.tsx
 *
 * Area chart showing cash balance over time with a green gradient fill.
 * Red danger-zone reference line for low cash threshold.
 */

"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { MonthlyMetric } from "@/data";
import { formatPeriod, formatCurrency } from "@/lib/utils";

interface CashRunwayChartProps {
  data: MonthlyMetric[];
  height?: number;
  dangerThreshold?: number;
}

export default function CashRunwayChart({
  data,
  height = 280,
  dangerThreshold,
}: CashRunwayChartProps) {
  const chartData = data.map((m) => ({
    period: formatPeriod(m.period),
    cash: m.cashBalance,
  }));

  const peakCash = Math.max(...data.map((m) => m.cashBalance));
  const threshold = dangerThreshold ?? peakCash * 0.15;

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-[#c8d8b8] mb-4">
        Cash Balance & Runway
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="cashGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5D7A3E" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#2B4D2F" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#1e3a1e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" />
          <XAxis
            dataKey="period"
            tick={{ fill: "#7a8a6e", fontSize: 10 }}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: "#7a8a6e", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCurrency(val, true)}
          />
          {/* Danger threshold — RAG red */}
          <ReferenceLine
            y={threshold}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label={{
              value: "Low Cash Warning",
              position: "right",
              fill: "#ef4444",
              fontSize: 10,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#162016",
              border: "1px solid #2B4D2F",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e2e8e0",
            }}
            formatter={(val) => [formatCurrency(Number(val), true), "Cash Balance"]}
          />
          <Area
            type="monotone"
            dataKey="cash"
            name="Cash Balance"
            stroke="#A3B84C"
            strokeWidth={2}
            fill="url(#cashGradientGreen)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
