/**
 * Homepage — Portfolio Command Center
 *
 * The first thing a portfolio manager sees. Designed to answer
 * the question: "What do I need to know right now?"
 *
 * Structure:
 * 1. Dark header banner with title
 * 2. Portfolio pulse KPIs (top-level numbers)
 * 3. Status breakdown (traffic lights)
 * 4. Company status table with sparklines
 * 5. Sector and capital composition charts
 */

import KpiCard from "@/components/KpiCard";
import CompanyTable from "@/components/CompanyTable";
import PortfolioCharts from "@/components/PortfolioCharts";
import {
  getPortfolioSummary,
  generateAlerts,
  getCompanies,
  getLatestQuarterly,
  getPreviousQuarterly,
} from "@/data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  PieChart,
  Shield,
} from "lucide-react";

export default function HomePage() {
  const summary = getPortfolioSummary();
  const alerts = generateAlerts();
  const companies = getCompanies();

  // Compute portfolio-level QoQ revenue growth
  let totalRevCurrent = 0;
  let totalRevPrevious = 0;
  companies.forEach((c) => {
    const curr = getLatestQuarterly(c.id);
    const prev = getPreviousQuarterly(c.id);
    if (curr) totalRevCurrent += curr.revenue;
    if (prev) totalRevPrevious += prev.revenue;
  });
  const portfolioRevGrowth =
    totalRevPrevious > 0
      ? (totalRevCurrent - totalRevPrevious) / totalRevPrevious
      : 0;

  return (
    <div className="space-y-6">
      {/* ── Dark Header Banner ── */}
      <div className="dark-banner flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Portfolio Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            10 demo companies across Solar, Agriculture, Fintech, HealthTech, EdTech & WASH sectors - Latest data: Q1 2026
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider">
            Report Period
          </p>
          <p className="text-sm font-medium text-white">Q1 2026 (Mar 2026)</p>
        </div>
      </div>

      {/* ── Portfolio Pulse KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          label="Capital Deployed"
          value={formatCurrency(summary.totalCapitalDeployed, true)}
          subtext="across 10 companies"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Portfolio Revenue"
          value={formatCurrency(summary.portfolioRevenue, true)}
          subtext="latest quarter"
          trend={{
            direction: portfolioRevGrowth >= 0 ? "up" : "down",
            value: `${portfolioRevGrowth >= 0 ? "+" : ""}${formatPercent(portfolioRevGrowth)} QoQ`,
            isGood: portfolioRevGrowth >= 0,
          }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          label="Weighted Gross Margin"
          value={formatPercent(summary.weightedGrossMargin)}
          subtext="portfolio blended"
          icon={<PieChart className="w-4 h-4" />}
        />
        <KpiCard
          label="Portfolio EBITDA"
          value={formatCurrency(summary.portfolioEbitda, true)}
          subtext="latest quarter"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          label="Active Alerts"
          value={`${summary.totalAlerts}`}
          subtext={`${summary.criticalAlerts} critical`}
          trend={
            summary.criticalAlerts > 0
              ? {
                  direction: "up",
                  value: `${summary.criticalAlerts} critical`,
                  isGood: false,
                }
              : undefined
          }
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <KpiCard
          label="Equity / Debt Split"
          value={formatCurrency(summary.totalEquityInvested, true)}
          subtext={`${formatCurrency(summary.totalDebtOutstanding, true)} debt`}
          icon={<Shield className="w-4 h-4" />}
        />
      </div>

      {/* ── Status Breakdown Strip ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-3" style={{padding: '0.625rem 1rem'}}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
          <div>
            <p className="text-lg font-bold text-emerald-600 leading-tight">
              {summary.statusBreakdown.healthy}
            </p>
            <p className="text-xs text-slate-500">Healthy</p>
          </div>
        </div>
        <div className="card flex items-center gap-3" style={{padding: '0.625rem 1rem'}}>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0"></span>
          <div>
            <p className="text-lg font-bold text-amber-600 leading-tight">
              {summary.statusBreakdown.watch}
            </p>
            <p className="text-xs text-slate-500">Watch</p>
          </div>
        </div>
        <div className="card flex items-center gap-3" style={{padding: '0.625rem 1rem'}}>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
          <div>
            <p className="text-lg font-bold text-red-600 leading-tight">
              {summary.statusBreakdown.critical}
            </p>
            <p className="text-xs text-slate-500">Critical</p>
          </div>
        </div>
      </div>

      {/* ── Company Status Table ── */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          Portfolio Companies
        </h2>
        <CompanyTable />
      </div>

      {/* ── Portfolio Composition Charts ── */}
      <PortfolioCharts />
    </div>
  );
}
