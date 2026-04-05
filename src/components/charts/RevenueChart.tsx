/**
 * RevenueChart.tsx
 *
 * Monthly revenue bar chart (olive green) with EBITDA line overlay (orange).
 * Brand palette: green bars for revenue, orange line for EBITDA.
 */

"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { MonthlyMetric } from "@/data";
import { formatPeriod, formatCurrency } from "@/lib/utils";

interface RevenueChartProps {
  data: MonthlyMetric[];
  height?: number;
}

export default function RevenueChart({ data, height = 300 }: RevenueChartProps) {
  const chartData = data.map((m) => ({
    period: formatPeriod(m.period),
    revenue: m.revenue,
    ebitda: m.ebitda,
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-[#c8d8b8] mb-4">
        Revenue & EBITDA — Monthly
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
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
          <Tooltip
            contentStyle={{
              background: "#162016",
              border: "1px solid #2B4D2F",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e2e8e0",
            }}
            formatter={(val, name) => [
              formatCurrency(Number(val), true),
              name === "revenue" ? "Revenue" : "EBITDA",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#7a8a6e" }}
          />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#5D7A3E"
            opacity={0.8}
            radius={[2, 2, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="ebitda"
            name="EBITDA"
            stroke="#E8922D"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
