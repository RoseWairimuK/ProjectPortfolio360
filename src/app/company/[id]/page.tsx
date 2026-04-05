/**
 * Company Detail Page — /company/[id]
 *
 * Individual company deep-dive. Structured like an investment one-pager:
 *
 * 1. Company header with status badge and key info
 * 2. KPI strip (5-6 headline metrics)
 * 3. Revenue & EBITDA chart
 * 4. Margin evolution chart
 * 5. Cash balance & runway chart
 * 6. Business-specific metrics table
 * 7. Quarterly performance table
 * 8. Active alerts for this company
 * 9. Investment note / commentary
 *
 * Each company page renders from the same template but with
 * company-specific data, making the codebase maintainable.
 */

import { notFound } from "next/navigation";
import {
  getCompany,
  getMetrics,
  getLatestMonthly,
  getLatestQuarterly,
  getPreviousQuarterly,
  generateAlerts,
  getCompanies,
} from "@/data";
import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import RevenueChart from "@/components/charts/RevenueChart";
import MarginChart from "@/components/charts/MarginChart";
import CashRunwayChart from "@/components/charts/CashRunwayChart";
import CompanyQuarterlyTable from "@/components/CompanyQuarterlyTable";
import CompanyAlerts from "@/components/CompanyAlerts";
import CompanyInvestmentNote from "@/components/CompanyInvestmentNote";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  BarChart3,
  Shield,
} from "lucide-react";

// Generate static params for all companies so pages are pre-rendered
export async function generateStaticParams() {
  const companies = getCompanies();
  return companies.map((c) => ({ id: c.id }));
}

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return notFound();

  const metrics = getMetrics(id);
  if (!metrics) return notFound();

  const latest = getLatestMonthly(id);
  const latestQ = getLatestQuarterly(id);
  const prevQ = getPreviousQuarterly(id);
  const alerts = generateAlerts().filter((a) => a.companyId === id);

  // Revenue growth QoQ
  const revGrowthQoQ =
    latestQ && prevQ && prevQ.revenue > 0
      ? (latestQ.revenue - prevQ.revenue) / prevQ.revenue
      : null;

  return (
    <div className="space-y-6">
      {/* ── Company Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{company.name}</h1>
            <StatusBadge status={company.status} size="md" />
          </div>
          <p className="text-sm text-slate-400 max-w-2xl">
            {company.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>{company.sector}</span>
            <span>•</span>
            <span>{company.country}</span>
            <span>•</span>
            <span>Est. {company.foundedYear}</span>
            <span>•</span>
            <span className="capitalize">{company.financeType} financed</span>
            <span>•</span>
            <span>{company.stage}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider">
            Capital Deployed
          </p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(company.capitalDeployed, true)}
          </p>
          <p className="text-xs text-slate-500">{company.financeDetail}</p>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          label="Revenue (QTR)"
          value={latestQ ? formatCurrency(latestQ.revenue, true) : "—"}
          trend={
            revGrowthQoQ !== null
              ? {
                  direction: revGrowthQoQ >= 0 ? "up" : "down",
                  value: `${revGrowthQoQ >= 0 ? "+" : ""}${formatPercent(revGrowthQoQ)} QoQ`,
                  isGood: revGrowthQoQ >= 0,
                }
              : undefined
          }
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Gross Margin"
          value={latest ? formatPercent(latest.grossMargin) : "—"}
          icon={<Percent className="w-4 h-4" />}
        />
        <KpiCard
          label="EBITDA Margin"
          value={latest ? formatPercent(latest.ebitdaMargin) : "—"}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          label="Cash Balance"
          value={latest ? formatCurrency(latest.cashBalance, true) : "—"}
          subtext={
            latest && latest.runway < 99
              ? `${latest.runway.toFixed(0)} mo runway`
              : undefined
          }
          icon={<Wallet className="w-4 h-4" />}
        />
        <KpiCard
          label={company.keyMetricLabel}
          value={
            latest
              ? formatNumber(
                  (latest as Record<string, unknown>)[
                    getKeyMetricField(company.id)
                  ] as number
                )
              : "—"
          }
          icon={<BarChart3 className="w-4 h-4" />}
        />
        {latest && latest.debtOutstanding > 0 ? (
          <KpiCard
            label="Debt Outstanding"
            value={formatCurrency(latest.debtOutstanding, true)}
            subtext={latest.dscr ? `DSCR: ${latest.dscr.toFixed(1)}x` : undefined}
            icon={<Shield className="w-4 h-4" />}
          />
        ) : (
          <KpiCard
            label="Conviction"
            value={company.convictionLevel.toUpperCase()}
            subtext={company.convictionLevel === "high" ? "Strong outlook" : company.convictionLevel === "medium" ? "Monitor closely" : "Under review"}
            icon={<Shield className="w-4 h-4" />}
          />
        )}
      </div>

      {/* ── Charts Row 1: Revenue & Margins ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={metrics.monthly} />
        <MarginChart data={metrics.monthly} />
      </div>

      {/* ── Chart Row 2: Cash Position ── */}
      <CashRunwayChart data={metrics.monthly} />

      {/* ── Quarterly Performance Table ── */}
      <CompanyQuarterlyTable data={metrics.quarterly} />

      {/* ── Active Alerts ── */}
      {alerts.length > 0 && <CompanyAlerts alerts={alerts} />}

      {/* ── Investment Note ── */}
      <CompanyInvestmentNote company={company} latest={latest} />
    </div>
  );
}

/**
 * Map company ID to its business-specific metric field name in the data.
 * Each company type has a different "key metric" that defines its health.
 */
function getKeyMetricField(companyId: string): string {
  const map: Record<string, string> = {
    kijanicold: "unitsDeployed",
    sungrid: "connections",
    brightstore: "activeCustomers",
    harvestfin: "activeLoans",
    greenbasket: "mtTraded",
    farmflow: "hectaresServiced",
    payswift: "activeMerchants",
    mediroute: "monthlyDeliveries",
    edubridge: "activeStudents",
    aquaclean: "activeKiosks",
  };
  return map[companyId] || "revenue";
}
