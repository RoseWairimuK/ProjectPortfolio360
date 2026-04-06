/**
 * CompanyAlerts.tsx
 *
 * Displays active alerts for a specific company on its detail page.
 * Each alert shows the metric, severity, current value, and suggested action.
 */

import { Alert } from "@/data";
import { cn, severityColor } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface CompanyAlertsProps {
  alerts: Alert[];
}

export default function CompanyAlerts({ alerts }: CompanyAlertsProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Active Alerts ({alerts.length})
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "rounded-lg border px-4 py-3",
              severityColor(alert.severity)
            )}
          >
            <div className="flex items-start gap-3">
              {/* Severity icon */}
              {alert.severity === "critical" ? (
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : alert.severity === "watch" ? (
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}

              <div className="flex-1">
                {/* Alert message */}
                <p className="text-sm font-medium">{alert.message}</p>

                {/* Details */}
                <div className="flex items-center gap-4 mt-1.5 text-xs opacity-80">
                  <span>
                    Metric: {alert.metricLabel}
                  </span>
                  <span>•</span>
                  <span>
                    Direction: {alert.direction}
                  </span>
                  <span>•</span>
                  <span>Period: {alert.triggeredPeriod}</span>
                </div>

                {/* Suggested action */}
                <p className="mt-2 text-xs opacity-70 italic">
                  Action: {alert.suggestedAction}
                </p>
              </div>

              {/* Severity badge */}
              <span className="text-[10px] uppercase tracking-wider font-bold flex-shrink-0">
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
