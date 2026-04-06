/**
 * About Page — /about
 *
 * Explains the need for portfolio intelligence systems and the benefits
 * they bring to any organisation managing a portfolio of companies.
 * This page is the entry point for recruiters, hiring managers, and
 * portfolio teams to understand the value proposition.
 */

import {
  Briefcase,
  BarChart3,
  AlertTriangle,
  Brain,
  Target,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* ── Dark Header Banner ── */}
      <div className="dark-banner">
        <h1 className="text-2xl font-bold text-white">
          About Portfolio360
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          Portfolio360 is a portfolio intelligence platform designed to show how
          investment analysis and data science can be combined to create
          real-time portfolio monitoring, early warning systems, and
          decision support tools for organisations managing portfolios of companies.
        </p>
      </div>

      {/* ── The Problem ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          The Problem: Portfolio Blind Spots
        </h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Any organisation managing a portfolio of investments &mdash; whether a venture capital fund,
            a development finance institution, a private equity firm, or a corporate venture arm &mdash;
            faces a fundamental challenge: <strong className="text-slate-800">staying on top of what matters
            across many companies at once.</strong>
          </p>
          <p>
            Portfolio teams are often overwhelmed by fragmented data. Financial reports arrive in
            different formats, at different times, with different levels of quality. Critical signals
            get buried in spreadsheets. By the time a problem surfaces in a quarterly review,
            weeks of intervention time have already been lost.
          </p>
          <p>
            The result? Reactive portfolio management instead of proactive support.
            Companies that needed attention three months ago only get it when the damage
            is already done.
          </p>
        </div>
      </div>

      {/* ── The Solution ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          The Solution: Portfolio Intelligence
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          A portfolio intelligence system transforms scattered data into a single source of truth.
          It gives portfolio managers the ability to see the health of every company at a glance,
          detect early warning signs before they become crises, and allocate attention where it
          will have the most impact.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <BarChart3 className="w-5 h-5 text-[#5D7A3E]" />,
              title: "Consolidated Visibility",
              desc: "See all portfolio companies in one view — revenue trends, margins, cash positions, and status indicators updated in real time.",
            },
            {
              icon: <AlertTriangle className="w-5 h-5 text-[#E8922D]" />,
              title: "Early Warning System",
              desc: "Threshold-based alerts flag deteriorating metrics before they become critical — runway, debt service coverage, margin compression, credit quality.",
            },
            {
              icon: <Brain className="w-5 h-5 text-[#7D9A3E]" />,
              title: "Investment Judgement Layer",
              desc: "Go beyond dashboards to conviction ranking, capital efficiency analysis, and recommended attention allocation across the portfolio.",
            },
            {
              icon: <Target className="w-5 h-5 text-[#E8922D]" />,
              title: "Proactive Intervention",
              desc: "Shift from reactive firefighting to proactive portfolio support — identify which companies need help and what kind of help they need.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-100"
            >
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefits for Portfolio Organisations ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Benefits for Portfolio Organisations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Clock className="w-6 h-6 text-[#5D7A3E]" />,
              title: "Save Time",
              desc: "Replace hours of spreadsheet wrangling with instant portfolio-wide visibility. Focus analyst time on insight, not data aggregation.",
            },
            {
              icon: <Shield className="w-6 h-6 text-[#E8922D]" />,
              title: "Reduce Risk",
              desc: "Catch early warning signals — cash runway shortfalls, covenant pressure, margin erosion — before they become portfolio write-offs.",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-[#7D9A3E]" />,
              title: "Improve Returns",
              desc: "Direct follow-on capital and management attention to the companies best positioned to deliver returns. Data-driven allocation outperforms intuition.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-4">
              <div className="flex justify-center mb-3">{item.icon}</div>
              <p className="text-sm font-semibold text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── What This Platform Demonstrates ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          What This Platform Demonstrates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Briefcase className="w-5 h-5 text-[#5D7A3E]" />,
              title: "Portfolio Monitoring",
              desc: "Consolidated view of 10 companies across 6 sectors, with traffic-light status, KPIs, and trend analysis.",
            },
            {
              icon: <AlertTriangle className="w-5 h-5 text-[#E8922D]" />,
              title: "Early Warning Alerts",
              desc: "Automated threshold-based alerts tied to investment-relevant metrics — runway, margins, debt service, credit quality.",
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-[#7D9A3E]" />,
              title: "Operational-to-Investment Bridge",
              desc: "Connecting business-specific KPIs (units deployed, PAR30, TPV, collection rates) to portfolio-level investment decisions.",
            },
            {
              icon: <Brain className="w-5 h-5 text-[#E8922D]" />,
              title: "Portfolio Allocation Thinking",
              desc: "Conviction ranking, capital efficiency analysis, and recommended attention allocation across the entire portfolio.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
            >
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About the Author ── */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">About the Author</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Built by <strong className="text-slate-800">Rosemary Kanyoro</strong> — combining an
          investment and portfolio analysis background with a Masters in Data Science & Analytics.
          This project represents the intersection of those two disciplines: the ability to think
          like an investor while building like a data engineer.
        </p>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          The goal is to demonstrate the kind of analytical thinking, data architecture, and
          product instinct that a VC, venture studio, or portfolio support team would value.
        </p>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-5 py-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-500">Disclaimer:</strong> All company names, financial data,
          and metrics shown on this site are entirely fictional and created for demonstration
          purposes only. No real companies, investments, or financial data are represented.
          This is a portfolio analytics capability showcase, not investment advice.
        </p>
      </div>
    </div>
  );
}
