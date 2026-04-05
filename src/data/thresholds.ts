/**
 * thresholds.ts
 *
 * Portfolio alert thresholds — the rules that determine when a metric
 * moves from "fine" to "watch" to "critical".
 *
 * These are investment-relevant thresholds, not generic data alerts.
 * Each threshold is designed to reflect what a portfolio manager
 * would actually care about when monitoring emerging market investees.
 */

export interface Threshold {
  metric: string;
  label: string;
  watchLevel: number;
  criticalLevel: number;
  direction: "below" | "above";  // "below" = bad when metric falls below threshold
  unit: string;
  description: string;
}

const thresholds: Threshold[] = [
  {
    metric: "runway",
    label: "Cash Runway",
    watchLevel: 8,
    criticalLevel: 4,
    direction: "below",
    unit: "months",
    description: "Months of cash remaining at current burn rate",
  },
  {
    metric: "grossMargin",
    label: "Gross Margin",
    watchLevel: 0.40,
    criticalLevel: 0.25,
    direction: "below",
    unit: "%",
    description: "Gross profit as percentage of revenue",
  },
  {
    metric: "ebitdaMargin",
    label: "EBITDA Margin",
    watchLevel: -0.10,
    criticalLevel: -0.30,
    direction: "below",
    unit: "%",
    description: "EBITDA as percentage of revenue — proxy for operational sustainability",
  },
  {
    metric: "revenueGrowthQoQ",
    label: "Revenue Growth (QoQ)",
    watchLevel: -0.05,
    criticalLevel: -0.15,
    direction: "below",
    unit: "%",
    description: "Quarter-over-quarter revenue change",
  },
  {
    metric: "dscr",
    label: "Debt Service Coverage",
    watchLevel: 1.5,
    criticalLevel: 1.2,
    direction: "below",
    unit: "x",
    description: "EBITDA divided by total debt service — measures ability to service debt",
  },
  {
    metric: "par30",
    label: "PAR > 30 Days",
    watchLevel: 0.05,
    criticalLevel: 0.10,
    direction: "above",
    unit: "%",
    description: "Portfolio at risk — loans overdue more than 30 days",
  },
  {
    metric: "collectionRate",
    label: "Collection Rate",
    watchLevel: 0.90,
    criticalLevel: 0.85,
    direction: "below",
    unit: "%",
    description: "Percentage of billed revenue actually collected",
  },
  {
    metric: "burnRate",
    label: "Monthly Burn Trend",
    watchLevel: -0.10,  // worsening by 10%+
    criticalLevel: -0.25,
    direction: "below",
    unit: "% change",
    description: "Month-over-month change in net cash burn",
  },
];

export default thresholds;
