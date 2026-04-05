/**
 * PortfolioDonut.tsx
 *
 * Donut/pie chart for portfolio composition views.
 * Default palette uses the green-to-orange brand gradient.
 */

"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DonutData {
  name: string;
  value: number;
}

interface PortfolioDonutProps {
  data: DonutData[];
  title: string;
  height?: number;
  colors?: string[];
  isCurrency?: boolean;
}

/* Brand palette: green-to-orange gradient for chart segments */
const DEFAULT_COLORS = [
  "#2B4D2F", // dark forest green
  "#5D7A3E", // olive green
  "#7D9A3E", // leaf green
  "#A3B84C", // yellow-green
  "#F0CE4E", // gold
  "#E8922D", // warm orange
  "#F5A623", // bright orange
  "#C47A1A", // deep amber
];

export default function PortfolioDonut({
  data,
  title,
  height = 260,
  colors = DEFAULT_COLORS,
  isCurrency = true,
}: PortfolioDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-[#c8d8b8] mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {data.map((_, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={colors[idx % colors.length]}
                opacity={0.9}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#162016",
              border: "1px solid #2B4D2F",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e2e8e0",
            }}
            formatter={(val, name) => {
              const v = Number(val);
              return [
                isCurrency
                  ? `${formatCurrency(v, true)} (${((v / total) * 100).toFixed(0)}%)`
                  : `${v} (${((v / total) * 100).toFixed(0)}%)`,
                String(name),
              ];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#7a8a6e" }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
