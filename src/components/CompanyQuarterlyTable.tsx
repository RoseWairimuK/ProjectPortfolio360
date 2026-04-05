/**
 * CompanyQuarterlyTable.tsx
 *
 * Quarterly financial performance table for individual company pages.
 * Shows the metrics a portfolio analyst reviews every quarter:
 * revenue, margins, EBITDA, cash, and debt metrics.
 */

"use client";

import { QuarterlyMetric } from "@/data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

interface CompanyQuarterlyTableProps {
  data: QuarterlyMetric[];
}

export default function CompanyQuarterlyTable({ data }: CompanyQuarterlyTableProps) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="px-5 py-3 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-300">
          Quarterly Performance Summary
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="text-left px-4 py-2.5 font-medium">Quarter</th>
              <th className="text-right px-4 py-2.5 font-medium">Revenue</th>
              <th className="text-right px-4 py-2.5 font-medium">QoQ Growth</th>
              <th className="text-right px-4 py-2.5 font-medium">Gross Margin</th>
              <th className="text-right px-4 py-2.5 font-medium">EBITDA</th>
              <th className="text-right px-4 py-2.5 font-medium">EBITDA %</th>
              <th className="text-right px-4 py-2.5 font-medium">Cash</th>
              {data.some((d) => d.debtOutstanding > 0) && (
                <th className="text-right px-4 py-2.5 font-medium">Debt</th>
              )}
              {data.some((d) => d.dscr !== null && d.dscr > 0) && (
                <th className="text-right px-4 py-2.5 font-medium">DSCR</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((q, idx) => {
              const prev = idx > 0 ? data[idx - 1] : null;
              const revGrowth =
                prev && prev.revenue > 0
                  ? (q.revenue - prev.revenue) / prev.revenue
                  : null;

              return (
                <tr
                  key={q.period}
                  className="border-b border-slate-800/50 hover:bg-slate-800/20"
                >
                  <td className="px-4 py-2.5 font-medium text-white">
                    {q.period}
                  </td>
                  <td className="px-4 py-2.5 text-right text-white">
                    {formatCurrency(q.revenue, true)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {revGrowth !== null ? (
                      <span
                        className={cn(
                          revGrowth >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {revGrowth >= 0 ? "+" : ""}
                        {formatPercent(revGrowth)}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-300">
                    {formatPercent(q.grossMargin)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right",
                      q.ebitda >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {formatCurrency(q.ebitda, true)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right",
                      q.ebitdaMargin >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {formatPercent(q.ebitdaMargin)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-300">
                    {formatCurrency(q.cashBalance, true)}
                  </td>
                  {data.some((d) => d.debtOutstanding > 0) && (
                    <td className="px-4 py-2.5 text-right text-slate-300">
                      {q.debtOutstanding > 0
                        ? formatCurrency(q.debtOutstanding, true)
                        : "—"}
                    </td>
                  )}
                  {data.some((d) => d.dscr !== null && d.dscr > 0) && (
                    <td className="px-4 py-2.5 text-right">
                      {q.dscr !== null && q.dscr > 0 ? (
                        <span
                          className={cn(
                            q.dscr >= 1.5
                              ? "text-emerald-400"
                              : q.dscr >= 1.2
                                ? "text-amber-400"
                                : "text-red-400"
                          )}
                        >
                          {q.dscr.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
