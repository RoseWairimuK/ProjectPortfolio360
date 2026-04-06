/**
 * Alerts Page — /alerts
 *
 * Portfolio-wide early warning system. Not a generic notification feed,
 * but an investment-relevant triage view:
 *
 * - Critical: Requires immediate action (red)
 * - Watch: Deteriorating but not yet critical (amber)
 */

import Link from "next/link";
import { generateAlerts } from "@/data";
import { cn, severityColor } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";

export default function AlertsPage() {
  const alerts = generateAlerts();
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const watchAlerts = alerts.filter((a) => a.severity === "watch");

  return (
    <div className="space-y-6">
      {/* ── Dark Header Banner ── */}
      <div className="dark-banner">
        <h1 className="text-2xl font-bold text-white">
          Early Warning & Alerts
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Threshold-based monitoring across all portfolio companies.
          Alerts are triggered when key metrics breach investment-relevant thresholds.
        </p>
      </div>

      {/* ── Summary Strip ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Total Active Alerts
          </p>
          <p className="text-3xl font-bold text-slate-800">{alerts.length}</p>
        </div>
        <div className="card border-red-200">
          <p className="text-xs text-red-600 uppercase tracking-wider mb-1">
            Critical
          </p>
          <p className="text-3xl font-bold text-red-600">{criticalAlerts.length}</p>
          <p className="text-xs text-slate-500 mt-1">Requires immediate action</p>
        </div>
        <div className="card border-amber-200">
          <p className="text-xs text-amber-600 uppercase tracking-wider mb-1">
            Watch
          </p>
          <p className="text-3xl font-bold text-amber-600">{watchAlerts.length}</p>
          <p className="text-xs text-slate-500 mt-1">Monitor closely</p>
        </div>
      </div>

      {/* ── Critical Alerts Section ── */}
      {criticalAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Critical: Action Required
          </h2>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* ── Watch Alerts Section ── */}
      {watchAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-amber-600 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Watch: Monitor Closely
          </h2>
          <div className="space-y-3">
            {watchAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* ── No alerts state ── */}
      {alerts.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-slate-500">
            No active alerts. All portfolio metrics within acceptable thresholds.
          </p>
        </div>
      )}

      {/* ── Threshold Reference ── */}
      <div className="card">
        <h3 className="text-sm font-medium text-slate-700 mb-4">
          Alert Threshold Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="text-left px-3 py-2 font-medium">Metric</th>
                <th className="text-right px-3 py-2 font-medium">Watch Level</th>
                <th className="text-right px-3 py-2 font-medium">Critical Level</th>
                <th className="text-left px-3 py-2 font-medium">Direction</th>
                <th className="text-left px-3 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Cash Runway", watch: "< 8 months", critical: "< 4 months", dir: "Below", desc: "Months of cash at current burn" },
                { label: "Gross Margin", watch: "< 40%", critical: "< 25%", dir: "Below", desc: "Gross profit / revenue" },
                { label: "EBITDA Margin", watch: "< -10%", critical: "< -30%", dir: "Below", desc: "Operating profitability proxy" },
                { label: "Revenue Growth QoQ", watch: "< -5%", critical: "< -15%", dir: "Below", desc: "Quarter-over-quarter revenue change" },
                { label: "DSCR", watch: "< 1.5x", critical: "< 1.2x", dir: "Below", desc: "Debt service coverage ratio" },
                { label: "PAR > 30 Days", watch: "> 5%", critical: "> 10%", dir: "Above", desc: "Loan portfolio at risk" },
                { label: "Collection Rate", watch: "< 90%", critical: "< 85%", dir: "Below", desc: "Revenue actually collected" },
              ].map((row) => (
                <tr key={row.label} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-700">{row.label}</td>
                  <td className="px-3 py-2 text-right text-amber-600">{row.watch}</td>
                  <td className="px-3 py-2 text-right text-red-600">{row.critical}</td>
                  <td className="px-3 py-2 text-slate-500">{row.dir}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Individual alert card component */
function AlertCard({ alert }: { alert: ReturnType<typeof generateAlerts>[0] }) {
  const directionIcon =
    alert.direction === "deteriorating" ? (
      <TrendingDown className="w-3.5 h-3.5" />
    ) : alert.direction === "improving" ? (
      <TrendingUp className="w-3.5 h-3.5" />
    ) : (
      <Minus className="w-3.5 h-3.5" />
    );

  return (
    <div
      className={cn(
        "card rounded-lg border px-5 py-4",
        severityColor(alert.severity)
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Company name + alert message */}
          <div className="flex items-center gap-2 mb-1">
            {alert.severity === "critical" ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <p className="text-sm font-semibold">{alert.message}</p>
          </div>

          {/* Metric details */}
          <div className="flex items-center gap-4 mt-2 text-xs opacity-80">
            <span className="flex items-center gap-1">
              {directionIcon}
              {alert.direction}
            </span>
            <span>•</span>
            <span>Current: {alert.currentValue} {alert.unit}</span>
            <span>•</span>
            <span>Period: {alert.triggeredPeriod}</span>
          </div>

          {/* Suggested action */}
          <div className="mt-3 text-xs opacity-70 bg-black/5 rounded px-3 py-2">
            <span className="font-medium">Recommended action: </span>
            {alert.suggestedAction}
          </div>
        </div>

        {/* Link to company */}
        <Link
          href={`/company/${alert.companyId}`}
          className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity ml-4 flex-shrink-0"
        >
          View <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
