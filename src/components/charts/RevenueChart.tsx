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
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Revenue & EBITDA — Monthly
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
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
            tickFormatter={(val) => formatCurrency(val, true)}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e2e8f0",
            }}
            formatter={(val, name) => [
              formatCurrency(Number(val), true),
              name === "revenue" ? "Revenue" : "EBITDA",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
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
