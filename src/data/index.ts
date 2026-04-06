/**
 * data/index.ts
 *
 * Central data access layer for Portfolio360.
 * Imports all company metadata and metrics, and provides
 * helper functions for accessing and computing derived values.
 *
 * All data is loaded at build time (static import) —
 * no database or API calls needed.
 */

import companies, { Company, CompanyStatus } from "./companies";
import thresholds, { Threshold } from "./thresholds";

// Import all company metrics JSON files
import kijanicoldData from "./metrics/kijanicold.json";
import sungridData from "./metrics/sungrid.json";
import brightstoreData from "./metrics/brightstore.json";
import harvestfinData from "./metrics/harvestfin.json";
import greenbasketData from "./metrics/greenbasket.json";
import farmflowData from "./metrics/farmflow.json";
import payswiftData from "./metrics/payswift.json";
import medirouteData from "./metrics/mediroute.json";
import edubridgeData from "./metrics/edubridge.json";
import aquacleanData from "./metrics/aquaclean.json";

// ─── TYPES ──────────────────────────────────────────────────────

export interface MonthlyMetric {
  period: string;
  revenue: number;
  grossProfit: number;
  grossMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  netIncome: number;
  cashBalance: number;
  burnRate: number;
  runway: number;
  capex: number;
  debtOutstanding: number;
  debtService: number;
  dscr: number | null;
  [key: string]: unknown;  // business-specific metrics
}

export interface QuarterlyMetric {
  period: string;
  revenue: number;
  grossProfit: number;
  grossMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  cashBalance: number;
  burnRate: number;
  runway: number;
  netIncome: number;
  capex: number;
  debtOutstanding: number;
  debtService: number;
  dscr: number | null;
}

export interface AnnualMetric {
  period: string;
  revenue: number;
  grossProfit: number;
  grossMargin: number;
  ebitda: number;
  ebitdaMargin: number;
  netIncome: number;
  cashBalance: number;
  debtOutstanding: number;
  capex: number;
  debtService: number;
  dscr: number | null;
}

export interface CompanyMetrics {
  companyId: string;
  monthly: MonthlyMetric[];
  quarterly: QuarterlyMetric[];
  annual: AnnualMetric[];
}

export interface Alert {
  id: string;
  companyId: string;
  companyName: string;
  severity: "critical" | "watch" | "info";
  metric: string;
  metricLabel: string;
  currentValue: number;
  threshold: number;
  unit: string;
  direction: "deteriorating" | "stable" | "improving";
  message: string;
  triggeredPeriod: string;
  suggestedAction: string;
}

// ─── METRICS MAP ────────────────────────────────────────────────

const metricsMap: Record<string, CompanyMetrics> = {
  kijanicold: kijanicoldData as unknown as CompanyMetrics,
  sungrid: sungridData as unknown as CompanyMetrics,
  brightstore: brightstoreData as unknown as CompanyMetrics,
  harvestfin: harvestfinData as unknown as CompanyMetrics,
  greenbasket: greenbasketData as unknown as CompanyMetrics,
  farmflow: farmflowData as unknown as CompanyMetrics,
  payswift: payswiftData as unknown as CompanyMetrics,
  mediroute: medirouteData as unknown as CompanyMetrics,
  edubridge: edubridgeData as unknown as CompanyMetrics,
  aquaclean: aquacleanData as unknown as CompanyMetrics,
};

// ─── ACCESSOR FUNCTIONS ─────────────────────────────────────────

/** Get all companies */
export function getCompanies(): Company[] {
  return companies;
}

/** Get a single company by ID */
export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

/** Get metrics for a company */
export function getMetrics(companyId: string): CompanyMetrics | undefined {
  return metricsMap[companyId];
}

/** Get the latest monthly data point for a company */
export function getLatestMonthly(companyId: string): MonthlyMetric | undefined {
  const metrics = metricsMap[companyId];
  if (!metrics) return undefined;
  return metrics.monthly[metrics.monthly.length - 1];
}

/** Get the latest quarterly data point */
export function getLatestQuarterly(companyId: string): QuarterlyMetric | undefined {
  const metrics = metricsMap[companyId];
  if (!metrics) return undefined;
  return metrics.quarterly[metrics.quarterly.length - 1];
}

/** Get the previous quarterly data point (for QoQ comparison) */
export function getPreviousQuarterly(companyId: string): QuarterlyMetric | undefined {
  const metrics = metricsMap[companyId];
  if (!metrics || metrics.quarterly.length < 2) return undefined;
  return metrics.quarterly[metrics.quarterly.length - 2];
}

// ─── COMPUTED METRICS ───────────────────────────────────────────

/** Compute QoQ revenue growth for a company */
export function getRevenueGrowthQoQ(companyId: string): number | null {
  const current = getLatestQuarterly(companyId);
  const previous = getPreviousQuarterly(companyId);
  if (!current || !previous || previous.revenue === 0) return null;
  return (current.revenue - previous.revenue) / previous.revenue;
}

/** Compute YoY revenue growth */
export function getRevenueGrowthYoY(companyId: string): number | null {
  const metrics = metricsMap[companyId];
  if (!metrics || metrics.annual.length < 2) return null;
  const current = metrics.annual[metrics.annual.length - 1];
  const previous = metrics.annual[metrics.annual.length - 2];
  if (previous.revenue === 0) return null;
  return (current.revenue - previous.revenue) / previous.revenue;
}

/** Get burn trend (is burn worsening?) */
export function getBurnTrend(companyId: string): number | null {
  const metrics = metricsMap[companyId];
  if (!metrics || metrics.monthly.length < 4) return null;
  const recent = metrics.monthly.slice(-3);
  const prior = metrics.monthly.slice(-6, -3);
  const avgRecent = recent.reduce((s, m) => s + m.burnRate, 0) / 3;
  const avgPrior = prior.reduce((s, m) => s + m.burnRate, 0) / 3;
  if (avgPrior === 0) return null;
  return (avgRecent - avgPrior) / Math.abs(avgPrior);
}

// ─── ALERT GENERATION ───────────────────────────────────────────

/**
 * Generate alerts for all companies based on their latest data
 * and the defined thresholds.
 *
 * This is the core "portfolio intelligence" logic —
 * it programmatically identifies which companies need attention
 * and why, rather than requiring manual review of every metric.
 */
export function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;

  for (const company of companies) {
    const latest = getLatestMonthly(company.id);
    const latestQ = getLatestQuarterly(company.id);
    if (!latest || !latestQ) continue;

    // Check each threshold
    for (const t of thresholds) {
      let currentValue: number | null = null;
      let shouldAlert = false;

      switch (t.metric) {
        case "runway":
          currentValue = latest.runway;
          if (currentValue < 99) {
            shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          }
          break;

        case "grossMargin":
          currentValue = latest.grossMargin;
          shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          break;

        case "ebitdaMargin":
          currentValue = latest.ebitdaMargin;
          shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          break;

        case "revenueGrowthQoQ":
          currentValue = getRevenueGrowthQoQ(company.id);
          if (currentValue !== null) {
            shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          }
          break;

        case "dscr":
          currentValue = latest.dscr;
          if (currentValue !== null && currentValue > 0) {
            shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          }
          break;

        case "par30": {
          const par = (latest as Record<string, unknown>)["par30"] as number | undefined;
          if (par !== undefined) {
            currentValue = par;
            shouldAlert = t.direction === "above" && currentValue > t.watchLevel;
          }
          break;
        }

        case "collectionRate": {
          const cr = (latest as Record<string, unknown>)["collectionRate"] as number | undefined;
          if (cr !== undefined) {
            currentValue = cr;
            shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          }
          break;
        }

        case "burnRate":
          currentValue = getBurnTrend(company.id);
          if (currentValue !== null) {
            shouldAlert = t.direction === "below" && currentValue < t.watchLevel;
          }
          break;
      }

      if (shouldAlert && currentValue !== null) {
        const isCritical =
          t.direction === "below"
            ? currentValue < t.criticalLevel
            : currentValue > t.criticalLevel;

        // Determine trend direction
        const metrics = metricsMap[company.id];
        let direction: "deteriorating" | "stable" | "improving" = "stable";
        if (metrics && metrics.monthly.length >= 3) {
          const prev = metrics.monthly[metrics.monthly.length - 3];
          const prevVal = (prev as Record<string, unknown>)[t.metric] as number | undefined;
          if (prevVal !== undefined && currentValue !== undefined) {
            if (t.direction === "below") {
              direction = currentValue < prevVal ? "deteriorating" : "improving";
            } else {
              direction = currentValue > prevVal ? "deteriorating" : "improving";
            }
          }
        }

        alerts.push({
          id: `alert-${String(alertId++).padStart(3, "0")}`,
          companyId: company.id,
          companyName: company.name,
          severity: isCritical ? "critical" : "watch",
          metric: t.metric,
          metricLabel: t.label,
          currentValue: Math.round(currentValue * (t.unit === "%" ? 100 : 1) * 100) / 100,
          threshold: t.direction === "below" ? t.watchLevel : t.watchLevel,
          unit: t.unit,
          direction,
          message: generateAlertMessage(company.name, t, currentValue, isCritical),
          triggeredPeriod: latest.period,
          suggestedAction: generateSuggestedAction(t.metric, isCritical, company),
        });
      }
    }
  }

  // Sort: critical first, then watch, then by company
  alerts.sort((a, b) => {
    const sevOrder = { critical: 0, watch: 1, info: 2 };
    return sevOrder[a.severity] - sevOrder[b.severity];
  });

  return alerts;
}

/** Generate human-readable alert message */
function generateAlertMessage(
  companyName: string,
  threshold: Threshold,
  value: number,
  isCritical: boolean
): string {
  const severity = isCritical ? "CRITICAL" : "WATCH";
  const formatted =
    threshold.unit === "%"
      ? `${(value * 100).toFixed(1)}%`
      : threshold.unit === "x"
        ? `${value.toFixed(2)}x`
        : threshold.unit === "months"
          ? `${value.toFixed(1)} months`
          : `${value.toFixed(2)}`;

  return `${companyName}: ${threshold.label} at ${formatted} - ${severity.toLowerCase()} threshold breached`;
}

/** Generate investment-relevant suggested action */
function generateSuggestedAction(
  metric: string,
  isCritical: boolean,
  company: Company
): string {
  const actions: Record<string, string[]> = {
    runway: [
      "Review cash forecast and identify near-term levers to extend runway",
      "Initiate bridge financing discussion immediately -runway critically low",
    ],
    grossMargin: [
      "Analyse margin drivers -pricing pressure vs cost inflation. Request management commentary",
      "Urgent margin review needed. Assess whether business model is fundamentally viable at current scale",
    ],
    ebitdaMargin: [
      "Review opex efficiency and path to breakeven. Consider targeted cost reduction",
      "Operating losses widening. Assess whether additional capital or restructuring is needed",
    ],
    revenueGrowthQoQ: [
      "Request pipeline and customer acquisition data. Assess whether slowdown is seasonal or structural",
      "Revenue declining -investigate root cause. Consider strategic review of go-to-market",
    ],
    dscr: [
      "Monitor debt service capacity closely. Review covenant compliance with lender",
      "Debt service at risk. Engage lender proactively on restructuring or forbearance",
    ],
    par30: [
      "Tighten credit scoring criteria. Review collection process effectiveness",
      "Credit quality deteriorating rapidly. Consider portfolio tightening and provisioning increase",
    ],
    collectionRate: [
      "Review collection infrastructure and customer payment behaviour. Identify bottlenecks",
      "Collections significantly below target. Assess impact on cash flow and debt service capacity",
    ],
    burnRate: [
      "Review spending trajectory. Ensure burn aligns with growth milestones",
      "Burn accelerating -requires immediate management attention and spending controls",
    ],
  };

  const options = actions[metric] || [
    "Monitor metric closely next quarter",
    "Requires immediate attention from portfolio team",
  ];
  return isCritical ? options[1] : options[0];
}

// ─── PORTFOLIO AGGREGATES ───────────────────────────────────────

export interface PortfolioSummary {
  totalCompanies: number;
  totalCapitalDeployed: number;
  totalEquityInvested: number;
  totalDebtOutstanding: number;
  totalGrantsReceived: number;
  statusBreakdown: Record<CompanyStatus, number>;
  sectorExposure: Record<string, { count: number; capital: number; pct: number }>;
  financeTypeBreakdown: Record<string, { count: number; capital: number }>;
  portfolioRevenue: number;         // latest quarter total
  portfolioEbitda: number;
  weightedGrossMargin: number;
  totalAlerts: number;
  criticalAlerts: number;
}

/** Compute portfolio-level summary */
export function getPortfolioSummary(): PortfolioSummary {
  const alerts = generateAlerts();

  const totalCapitalDeployed = companies.reduce((s, c) => s + c.capitalDeployed, 0);
  const totalEquityInvested = companies.reduce((s, c) => s + c.equityInvested, 0);
  const totalDebtOutstanding = companies.reduce((s, c) => s + c.debtOutstanding, 0);
  const totalGrantsReceived = companies.reduce((s, c) => s + c.grantReceived, 0);

  // Status breakdown
  const statusBreakdown: Record<CompanyStatus, number> = { healthy: 0, watch: 0, critical: 0 };
  companies.forEach((c) => statusBreakdown[c.status]++);

  // Sector exposure
  const sectorExposure: Record<string, { count: number; capital: number; pct: number }> = {};
  companies.forEach((c) => {
    const cat = c.sectorCategory;
    if (!sectorExposure[cat]) sectorExposure[cat] = { count: 0, capital: 0, pct: 0 };
    sectorExposure[cat].count++;
    sectorExposure[cat].capital += c.capitalDeployed;
  });
  Object.values(sectorExposure).forEach((v) => {
    v.pct = v.capital / totalCapitalDeployed;
  });

  // Finance type breakdown
  const financeTypeBreakdown: Record<string, { count: number; capital: number }> = {};
  companies.forEach((c) => {
    if (!financeTypeBreakdown[c.financeType]) financeTypeBreakdown[c.financeType] = { count: 0, capital: 0 };
    financeTypeBreakdown[c.financeType].count++;
    financeTypeBreakdown[c.financeType].capital += c.capitalDeployed;
  });

  // Portfolio financials (latest quarter)
  let portfolioRevenue = 0;
  let portfolioEbitda = 0;
  let portfolioGrossProfit = 0;

  companies.forEach((c) => {
    const q = getLatestQuarterly(c.id);
    if (q) {
      portfolioRevenue += q.revenue;
      portfolioEbitda += q.ebitda;
      portfolioGrossProfit += q.grossProfit;
    }
  });

  return {
    totalCompanies: companies.length,
    totalCapitalDeployed,
    totalEquityInvested,
    totalDebtOutstanding,
    totalGrantsReceived,
    statusBreakdown,
    sectorExposure,
    financeTypeBreakdown,
    portfolioRevenue,
    portfolioEbitda,
    weightedGrossMargin: portfolioRevenue > 0 ? portfolioGrossProfit / portfolioRevenue : 0,
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter((a) => a.severity === "critical").length,
  };
}

// Re-export types and data
export { companies, thresholds };
export type { Company, CompanyStatus, Threshold };
