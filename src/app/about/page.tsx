/**
 * About Page — /about
 *
 * Explains what this project demonstrates and the methodology behind it.
 * This page is important for the recruiter/interviewer audience —
 * it contextualises the site as a deliberate capability demonstration.
 */

import {
  Briefcase,
  Database,
  BarChart3,
  Code2,
  AlertTriangle,
  Brain,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          About Portfolio360
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Portfolio360 is a portfolio analytics platform built to demonstrate
          how investment analysis and data science capability can be combined
          to create investment-grade portfolio monitoring, early warning systems,
          and decision support tools.
        </p>
      </div>

      {/* ── What This Demonstrates ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">
          What This Project Demonstrates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Briefcase className="w-5 h-5 text-blue-400" />,
              title: "Portfolio Monitoring",
              desc: "Consolidated view of 10 companies across 6 sectors, with traffic-light status, KPIs, and trend analysis.",
            },
            {
              icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
              title: "Early Warning System",
              desc: "Threshold-based alerts tied to investment-relevant metrics — runway, margins, debt service, credit quality.",
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
              title: "Operational Metrics → Investment Decisions",
              desc: "Connecting business-specific KPIs (units deployed, PAR30, TPV, collection rates) to portfolio-level judgement.",
            },
            {
              icon: <Brain className="w-5 h-5 text-purple-400" />,
              title: "Portfolio Allocation Thinking",
              desc: "Conviction ranking, capital efficiency analysis, and recommended attention allocation across the portfolio.",
            },
            {
              icon: <Database className="w-5 h-5 text-cyan-400" />,
              title: "Data Architecture",
              desc: "Structured data model: company metadata, 27 months of monthly metrics, quarterly rollups, and alert thresholds.",
            },
            {
              icon: <Code2 className="w-5 h-5 text-pink-400" />,
              title: "Technical Execution",
              desc: "Built with Next.js, TypeScript, Tailwind CSS, and Recharts. Deployed as a static site on Vercel.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30"
            >
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Methodology ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Methodology</h2>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            The portfolio consists of <strong className="text-white">10 simulated companies</strong> across
            popular emerging market sectors: 3 Solar, 3 Agriculture, and 4 other sectors
            (Fintech, HealthTech, EdTech, WASH). The data is entirely fictional but designed
            to be realistic in structure, scale, and behaviour.
          </p>
          <p>
            Each company has <strong className="text-white">27 months of monthly data</strong> (January 2024 through March 2026),
            rolled up into quarterly and annual views. The data was generated programmatically
            with sector-appropriate patterns:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
            <li>Seasonal demand curves (agriculture, solar, irrigation)</li>
            <li>Churn and attrition dynamics on growing customer/unit bases</li>
            <li>Margin expansion and compression trajectories</li>
            <li>Debt service schedules matched to business cash flows</li>
            <li>Working capital dynamics (receivable days, payable days)</li>
            <li>Credit quality deterioration (PAR30 trends) for lending businesses</li>
          </ul>
          <p>
            The <strong className="text-white">alert system</strong> uses threshold-based rules to flag when metrics breach
            investment-relevant levels. These are not generic data alerts — they are designed
            to trigger the kinds of conversations a portfolio support team would actually have.
          </p>
          <p>
            The <strong className="text-white">capital structure</strong> across the portfolio includes pure equity (4 companies),
            pure debt (3 companies), and blended/mixed structures (3 companies) — reflecting
            the reality that emerging market portfolios use diverse financing instruments.
          </p>
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Framework", value: "Next.js 15 (React)" },
            { label: "Language", value: "TypeScript" },
            { label: "Styling", value: "Tailwind CSS" },
            { label: "Charts", value: "Recharts" },
            { label: "Icons", value: "Lucide" },
            { label: "Hosting", value: "Vercel" },
            { label: "Data", value: "Static JSON (generated via Python)" },
            { label: "Data Generation", value: "Python (27 months × 10 companies)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-24">{item.label}:</span>
              <span className="text-sm text-slate-300">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── About Me ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">About the Author</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Built by <strong className="text-white">Rosemary Kanyoro</strong> — combining an
          investment and portfolio analysis background with a Masters in Data Science & Analytics.
          This project represents the intersection of those two disciplines: the ability to think
          like an investor while building like a data engineer.
        </p>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          The goal is not to build an enterprise SaaS platform on day one, but to demonstrate
          the kind of analytical thinking, data architecture, and product instinct that a
          VC, venture studio, or portfolio support team would value.
        </p>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-lg bg-slate-800/30 border border-slate-700 px-5 py-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong className="text-slate-400">Disclaimer:</strong> All company names, financial data,
          and metrics shown on this site are entirely fictional and created for demonstration
          purposes only. No real companies, investments, or financial data are represented.
          This is a portfolio analytics capability showcase, not investment advice.
        </p>
      </div>
    </div>
  );
}
