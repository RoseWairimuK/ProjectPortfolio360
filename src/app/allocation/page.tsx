/**
 * Portfolio Allocation Page — /allocation
 *
 * This page demonstrates portfolio JUDGEMENT, not just performance.
 * It shows:
 * - Which companies deserve more attention or capital
 * - Conviction ranking with rationale
 * - Capital efficiency metrics
 * - Sector and finance type diversification
 * - Portfolio concentration analysis
 *
 * This is the page that separates "I can build dashboards" from
 * "I can think about portfolio construction and allocation."
 */

import {
  getCompanies,
  getPortfolioSummary,
  getLatestQuarterly,
  getLatestMonthly,
  generateAlerts,
} from "@/data";
import PortfolioDonut from "@/components/charts/PortfolioDonut";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Scale,
  TrendingUp,
} from "lucide-react";

export default function AllocationPage() {
  const companies = getCompanies();
  const summary = getPortfolioSummary();
  const alerts = generateAlerts();

  // Sort companies by conviction: high → medium → low
  const convictionOrder = { high: 0, medium: 1, low: 2 };
  const sortedCompanies = [...companies].sort(
    (a, b) => convictionOrder[a.convictionLevel] - convictionOrder[b.convictionLevel]
  );

  // Capital efficiency: revenue per dollar deployed (latest quarter annualised)
  const capitalEfficiency = companies.map((c) => {
    const q = getLatestQuarterly(c.id);
    const annualisedRev = q ? q.revenue * 4 : 0;
    return {
      ...c,
      annualisedRev,
      capitalEfficiency: c.capitalDeployed > 0 ? annualisedRev / c.capitalDeployed : 0,
      latestEbitdaMargin: q ? q.ebitdaMargin : 0,
      alertCount: alerts.filter((a) => a.companyId === c.id).length,
    };
  }).sort((a, b) => b.capitalEfficiency - a.capitalEfficiency);

  // Sector exposure for donut
  const sectorData = Object.entries(summary.sectorExposure).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: val.capital,
  }));

  // Concentration: top 3 companies by capital deployed
  const sortedByCapital = [...companies].sort((a, b) => b.capitalDeployed - a.capitalDeployed);
  const top3Capital = sortedByCapital.slice(0, 3).reduce((s, c) => s + c.capitalDeployed, 0);
  const concentrationPct = top3Capital / summary.totalCapitalDeployed;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Portfolio Allocation & Judgement
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Capital allocation analysis, conviction ranking, and portfolio construction metrics.
          This view answers: where should the next dollar or hour of attention go?
        </p>
      </div>

      {/* ── Portfolio Construction KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Portfolio Size
          </p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summary.totalCapitalDeployed, true)}
          </p>
          <p className="text-xs text-slate-500">{summary.totalCompanies} companies</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Avg Ticket Size
          </p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(summary.totalCapitalDeployed / summary.totalCompanies, true)}
          </p>
          <p className="text-xs text-slate-500">per company</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Top 3 Concentration
          </p>
          <p className={cn(
            "text-2xl font-bold",
            concentrationPct > 0.6 ? "text-amber-400" : "text-white"
          )}>
            {formatPercent(concentrationPct)}
          </p>
          <p className="text-xs text-slate-500">of total capital</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            High Conviction
          </p>
          <p className="text-2xl font-bold text-emerald-400">
            {companies.filter((c) => c.convictionLevel === "high").length}
          </p>
          <p className="text-xs text-slate-500">
            of {summary.totalCompanies} companies
          </p>
        </div>
      </div>

      {/* ── Conviction Ranking Table ── */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-3 border-b border-slate-700 flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-medium text-slate-300">
            Conviction Ranking & Allocation View
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="text-left px-4 py-2.5 font-medium w-8">#</th>
                <th className="text-left px-4 py-2.5 font-medium">Company</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
                <th className="text-center px-4 py-2.5 font-medium">Conviction</th>
                <th className="text-right px-4 py-2.5 font-medium">Capital</th>
                <th className="text-right px-4 py-2.5 font-medium">% of Portfolio</th>
                <th className="text-right px-4 py-2.5 font-medium">Rev/Capital</th>
                <th className="text-right px-4 py-2.5 font-medium">EBITDA %</th>
                <th className="text-right px-4 py-2.5 font-medium">Alerts</th>
                <th className="text-left px-4 py-2.5 font-medium">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company, idx) => {
                const eff = capitalEfficiency.find((c) => c.id === company.id);
                const pctOfPortfolio = company.capitalDeployed / summary.totalCapitalDeployed;

                return (
                  <tr
                    key={company.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20"
                  >
                    <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{company.name}</p>
                      <p className="text-[11px] text-slate-500">{company.sector}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={company.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-bold uppercase px-2 py-0.5 rounded",
                          company.convictionLevel === "high"
                            ? "text-emerald-400 bg-emerald-400/10"
                            : company.convictionLevel === "medium"
                              ? "text-amber-400 bg-amber-400/10"
                              : "text-red-400 bg-red-400/10"
                        )}
                      >
                        {company.convictionLevel === "high" && <ArrowUpRight className="w-3 h-3" />}
                        {company.convictionLevel === "medium" && <Minus className="w-3 h-3" />}
                        {company.convictionLevel === "low" && <ArrowDownRight className="w-3 h-3" />}
                        {company.convictionLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {formatCurrency(company.capitalDeployed, true)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">
                      {formatPercent(pctOfPortfolio)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">
                      {eff ? `${eff.capitalEfficiency.toFixed(2)}x` : "—"}
                    </td>
                    <td className={cn(
                      "px-4 py-3 text-right",
                      eff && eff.latestEbitdaMargin >= 0 ? "text-emerald-400" : "text-red-400"
                    )}>
                      {eff ? formatPercent(eff.latestEbitdaMargin) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {eff && eff.alertCount > 0 ? (
                        <span className="text-amber-400 font-medium">{eff.alertCount}</span>
                      ) : (
                        <span className="text-slate-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                      {company.convictionRationale}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Capital Efficiency Ranking ── */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-medium text-slate-300">
            Capital Efficiency — Revenue per Dollar Deployed (Annualised)
          </h3>
        </div>
        <div className="space-y-2">
          {capitalEfficiency.map((c, idx) => {
            const maxEff = capitalEfficiency[0]?.capitalEfficiency || 1;
            const barWidth = (c.capitalEfficiency / maxEff) * 100;

            return (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-4">{idx + 1}</span>
                <span className="text-xs text-slate-300 w-32 truncate">
                  {c.name}
                </span>
                <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      c.capitalEfficiency > 1
                        ? "bg-emerald-500/60"
                        : c.capitalEfficiency > 0.5
                          ? "bg-blue-500/60"
                          : "bg-amber-500/60"
                    )}
                    style={{ width: `${Math.max(barWidth, 3)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-300 w-14 text-right">
                  {c.capitalEfficiency.toFixed(2)}x
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Portfolio Composition ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PortfolioDonut
          title="Sector Exposure"
          data={sectorData}
          colors={["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"]}
        />

        {/* Attention allocation recommendation */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-300">
              Attention Allocation — Where to Focus
            </h3>
          </div>
          <div className="space-y-3">
            {/* Critical attention */}
            <div className="rounded-lg bg-red-400/5 border border-red-400/20 px-4 py-3">
              <p className="text-xs font-medium text-red-400 uppercase tracking-wider mb-1">
                Immediate Attention Required
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-medium text-white">GreenBasket</span> — Margin compression and debt covenant pressure.
                Schedule management review within 2 weeks.
              </p>
            </div>

            {/* Watch items */}
            <div className="rounded-lg bg-amber-400/5 border border-amber-400/20 px-4 py-3">
              <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-1">
                Increased Monitoring
              </p>
              <div className="space-y-1.5 text-sm text-slate-300">
                <p>
                  <span className="font-medium text-white">HarvestFin</span> — PAR30 trending up. Request credit quality deep-dive.
                </p>
                <p>
                  <span className="font-medium text-white">SunGrid</span> — Collection rates weakening. Investigate root cause.
                </p>
                <p>
                  <span className="font-medium text-white">MediRoute</span> — Conv note maturity approaching. Plan for next round.
                </p>
              </div>
            </div>

            {/* Positive signal */}
            <div className="rounded-lg bg-emerald-400/5 border border-emerald-400/20 px-4 py-3">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">
                Candidates for Follow-On Capital
              </p>
              <div className="space-y-1.5 text-sm text-slate-300">
                <p>
                  <span className="font-medium text-white">PaySwift</span> — Strongest performer. Support Series B preparation.
                </p>
                <p>
                  <span className="font-medium text-white">BrightStore</span> — Explore facility upsize to accelerate growth.
                </p>
                <p>
                  <span className="font-medium text-white">KijaniCold</span> — Approaching Series A readiness. Strong unit economics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
