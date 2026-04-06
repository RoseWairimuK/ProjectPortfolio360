/**
 * CompanyTable.tsx
 *
 * Portfolio company status table — the core of the Command Center.
 * Shows all companies with their key metrics, status, and mini sparklines.
 *
 * This is not just a data table. It's designed to surface the information
 * a portfolio manager scans first thing every morning:
 *   - Which companies are green, amber, red?
 *   - What's the revenue trend?
 *   - How's the burn looking?
 *   - Any alerts I need to deal with?
 */

"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import MiniChart from "./MiniChart";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import {
  getCompanies,
  getMetrics,
  getLatestMonthly,
  getLatestQuarterly,
  getPreviousQuarterly,
  generateAlerts,
  Company,
} from "@/data";

export default function CompanyTable() {
  const companies = getCompanies();
  const alerts = generateAlerts();

  return (
    <div className="card overflow-hidden p-0">
      {/* Table header — dark green accent strip */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_120px_40px] gap-2 px-5 py-3 bg-[#162016] border-b border-[#1e3a1e] text-[10px] font-medium text-[#9aaa8e] uppercase tracking-wider">
        <span>Company</span>
        <span>Status</span>
        <span className="text-right">Revenue (QTR)</span>
        <span className="text-right">Gross Margin</span>
        <span className="text-right">EBITDA Margin</span>
        <span className="text-right">Cash Balance</span>
        <span className="text-right">Alerts</span>
        <span className="text-center">Trend (6mo)</span>
        <span></span>
      </div>

      {/* Company rows */}
      {companies.map((company: Company) => {
        const latest = getLatestMonthly(company.id);
        const latestQ = getLatestQuarterly(company.id);
        const prevQ = getPreviousQuarterly(company.id);
        const metrics = getMetrics(company.id);
        const companyAlerts = alerts.filter((a) => a.companyId === company.id);

        // Revenue sparkline data (last 6 months)
        const sparkData = metrics
          ? metrics.monthly.slice(-6).map((m) => ({
              value: m.revenue,
              label: m.period,
            }))
          : [];

        // Revenue growth QoQ
        const revGrowth =
          latestQ && prevQ && prevQ.revenue > 0
            ? (latestQ.revenue - prevQ.revenue) / prevQ.revenue
            : null;

        return (
          <Link
            key={company.id}
            href={`/company/${company.id}`}
            className={cn(
              "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_120px_40px] gap-2 px-5 py-3.5",
              "border-b border-slate-100 items-center",
              "hover:bg-slate-50 transition-colors cursor-pointer group"
            )}
          >
            {/* Company name + sector */}
            <div>
              <p className="text-sm font-medium text-slate-800 group-hover:text-[#E8922D] transition-colors">
                {company.name}
              </p>
              <p className="text-[11px] text-slate-400">{company.sector}</p>
            </div>

            {/* Status badge */}
            <div>
              <StatusBadge status={company.status} />
            </div>

            {/* Revenue (latest quarter) */}
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">
                {latestQ ? formatCurrency(latestQ.revenue, true) : "—"}
              </p>
              {revGrowth !== null && (
                <p
                  className={cn(
                    "text-[11px]",
                    revGrowth >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {revGrowth >= 0 ? "+" : ""}
                  {formatPercent(revGrowth)}
                  {" QoQ"}
                </p>
              )}
            </div>

            {/* Gross Margin */}
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">
                {latest ? formatPercent(latest.grossMargin) : "—"}
              </p>
            </div>

            {/* EBITDA Margin */}
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-medium",
                  latest && latest.ebitdaMargin >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                {latest ? formatPercent(latest.ebitdaMargin) : "—"}
              </p>
            </div>

            {/* Cash Balance */}
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">
                {latest ? formatCurrency(latest.cashBalance, true) : "—"}
              </p>
              {latest && latest.runway < 99 && (
                <p
                  className={cn(
                    "text-[11px]",
                    latest.runway < 4
                      ? "text-red-400"
                      : latest.runway < 8
                        ? "text-amber-400"
                        : "text-slate-400"
                  )}
                >
                  {latest.runway.toFixed(0)} mo runway
                </p>
              )}
            </div>

            {/* Alert count */}
            <div className="text-right">
              {companyAlerts.length > 0 ? (
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                    companyAlerts.some((a) => a.severity === "critical")
                      ? "bg-red-400/20 text-red-400"
                      : "bg-amber-400/20 text-amber-400"
                  )}
                >
                  {companyAlerts.length}
                </span>
              ) : (
                <span className="text-xs text-slate-600">0</span>
              )}
            </div>

            {/* Mini sparkline */}
            <div className="px-2">
              <MiniChart data={sparkData} color="auto" height={32} />
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
