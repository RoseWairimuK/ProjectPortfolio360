/**
 * PortfolioCharts.tsx
 *
 * Portfolio-level composition charts shown on the Command Center.
 * Includes: sector exposure, finance type breakdown, and capital allocation.
 */

"use client";

import PortfolioDonut from "./charts/PortfolioDonut";
import { getPortfolioSummary } from "@/data";

export default function PortfolioCharts() {
  const summary = getPortfolioSummary();

  // Sector exposure data
  const sectorData = Object.entries(summary.sectorExposure).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: val.capital,
  }));

  // Finance type data
  const financeData = Object.entries(summary.financeTypeBreakdown).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: val.capital,
  }));

  // Capital structure (equity vs debt vs grants)
  const capitalData = [
    { name: "Equity", value: summary.totalEquityInvested },
    { name: "Debt", value: summary.totalDebtOutstanding },
    ...(summary.totalGrantsReceived > 0
      ? [{ name: "Grants", value: summary.totalGrantsReceived }]
      : []),
  ].filter((d) => d.value > 0);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-3">
        Portfolio Composition
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PortfolioDonut
          title="Sector Exposure"
          data={sectorData}
          colors={["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]}
        />
        <PortfolioDonut
          title="Finance Type"
          data={financeData}
          colors={["#3b82f6", "#f59e0b", "#8b5cf6"]}
        />
        <PortfolioDonut
          title="Capital Structure"
          data={capitalData}
          colors={["#3b82f6", "#ef4444", "#10b981"]}
        />
      </div>
    </div>
  );
}
