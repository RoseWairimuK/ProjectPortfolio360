/**
 * CompanyInvestmentNote.tsx
 *
 * Simulated investment analyst commentary for each company.
 * This is what makes the site feel like "portfolio intelligence"
 * rather than just a dashboard — it shows analytical judgement,
 * not just data display.
 *
 * In a real system, this would be written by the portfolio team.
 * Here we simulate it based on each company's data patterns.
 */

import { Company, MonthlyMetric } from "@/data";

interface CompanyInvestmentNoteProps {
  company: Company;
  latest: MonthlyMetric | undefined;
}

/** Pre-written investment commentary for each company */
const investmentNotes: Record<string, {
  thesis: string;
  currentView: string;
  keyRisks: string[];
  nextActions: string[];
}> = {
  kijanicold: {
    thesis: "KijaniCold represents a compelling asset-leasing play in Kenya's cold chain gap. Unit economics are strong and improving — the payback period has compressed from ~48 months to ~35 months as utilisation and pricing scale together.",
    currentView: "The company is approaching operational breakeven with EBITDA turning positive. Fleet deployment is on track at 3 units/month with churn manageable at 2.5%. Seasonal demand patterns are well-understood and the model accounts for them. The key question remains capital efficiency — the business needs external funding not because the unit economics are broken, but because deploying assets consumes cash faster than the fleet generates it.",
    keyRisks: [
      "Cash runway depends on timely equity raises — any delay compresses buffer",
      "FX depreciation on imported solar units increases capex per unit over time",
      "Customer concentration in informal traders creates collection risk",
    ],
    nextActions: [
      "Begin Series A preparation targeting Q3-2026 close",
      "Monitor churn closely as fleet crosses 80-unit threshold",
      "Assess debt readiness for blended structure in 2027",
    ],
  },
  sungrid: {
    thesis: "SunGrid's mini-grid model has strong fundamentals — high-value infrastructure assets generating recurring revenue. The grant component de-risks early capex, and the connection pipeline is solid.",
    currentView: "Collection rates have weakened in the last two quarters, falling from 94% to below 90%. This is the key metric to watch. The asset base is growing but revenue per connection is not keeping pace if collection discipline slips. The grant runway provides a buffer, but the path to commercial sustainability requires collections to stabilise.",
    keyRisks: [
      "Collection rate deterioration — if this continues, the business model doesn't work",
      "Regulatory risk on tariff setting in Tanzania",
      "Grant dependency for capex — what happens when grant runs out?",
    ],
    nextActions: [
      "Deep dive on collection infrastructure — is it a process problem or a customer segment problem?",
      "Develop commercial sustainability roadmap independent of grant funding",
      "Consider pre-paid metering technology to improve collection certainty",
    ],
  },
  brightstore: {
    thesis: "BrightStore is a proven PAYG model with strong unit economics and high repayment rates. The debt-funded structure is appropriate — the receivables stream supports the asset finance facility well.",
    currentView: "Performing strongly. Repayment rates above 92%, DSCR comfortable, and customer acquisition scaling. The debt facility is being serviced comfortably with improving margins as the portfolio seasons. This is a portfolio company that demonstrates how asset-backed lending can work in EM solar.",
    keyRisks: [
      "Customer default risk if economic conditions deteriorate",
      "Technology obsolescence risk on solar home systems",
      "Distribution network dependency on third-party agents",
    ],
    nextActions: [
      "Explore facility upsize to accelerate distribution",
      "Monitor PAR30 as portfolio grows — quality vs quantity trade-off",
      "Assess geographic expansion opportunity into Western Uganda",
    ],
  },
  harvestfin: {
    thesis: "Digital crop lending at scale in Rwanda — strong revenue growth driven by farmer acquisition and increasing loan sizes. The satellite-based credit scoring is a genuine competitive edge.",
    currentView: "Revenue trajectory is impressive but PAR30 has been rising for two consecutive quarters, from 3.5% to approaching 8%. This is a classic agri-lending tension: growth is easy if you loosen credit standards. The provision expense is starting to eat into margins. We need clarity on whether this is a temporary seasonal effect or a structural credit quality issue.",
    keyRisks: [
      "Credit quality deterioration — PAR30 trend is the single biggest risk",
      "Seasonal agricultural cycles create lumpy cash flows",
      "Regulatory changes in Rwanda's fintech lending space",
    ],
    nextActions: [
      "Request vintage analysis on recent loan cohorts vs older cohorts",
      "Tighten credit scoring threshold and monitor impact on origination volume",
      "Engage management on collections strategy and team capacity",
    ],
  },
  greenbasket: {
    thesis: "Produce aggregation serving Nairobi's food supply chain. The model works in principle — buy from cooperatives, add value through cold logistics and grading, sell to urban retailers at a margin.",
    currentView: "This is the portfolio's most concerning company. Gross margins have compressed from 22% to below 12%, working capital intensity is rising, and the debt facility covenant is under pressure. The DSCR has dropped below lender thresholds. The business is caught in a squeeze: commodity price volatility on the buy side, price-sensitive retailers on the sell side, and growing receivable days suggesting customers are paying slower. Needs urgent attention.",
    keyRisks: [
      "Margin compression may be structural, not cyclical",
      "Debt covenant breach risk — lender relationship needs proactive management",
      "Working capital spiral — slower collections fund slower payments, creating a doom loop",
    ],
    nextActions: [
      "Immediate management review of gross margin drivers",
      "Engage lender on covenant waiver or restructuring before formal breach",
      "Assess whether emergency equity injection is needed to stabilise working capital",
    ],
  },
  farmflow: {
    thesis: "Irrigation-as-a-service in Ethiopia with project-financed infrastructure. The seasonal revenue pattern is well-matched to debt service. Expansion pipeline gives growth visibility.",
    currentView: "Performing well within its seasonal rhythm. DSCR consistently above 1.5x, with the debt structure intelligently matched to revenue seasonality (higher principal payments during irrigation season, holidays during rainy season). Hectares serviced growing in planned steps. This is a quiet, predictable performer — the kind of company that doesn't generate excitement but does generate reliable returns.",
    keyRisks: [
      "Ethiopian macro/political risk — currency, access, regulatory",
      "Climate risk — changing rainfall patterns could shift seasonal dynamics",
      "Single-geography concentration",
    ],
    nextActions: [
      "Explore expansion into adjacent regions",
      "Begin planning for facility refinancing in 2027",
      "Monitor Ethiopian regulatory environment for foreign-funded agriculture",
    ],
  },
  payswift: {
    thesis: "B2B payment processing in West Africa — a sector with massive TAM, strong network effects, and improving unit economics as TPV scales.",
    currentView: "PaySwift is the portfolio's star performer. Revenue growing >80% YoY, TPV scaling rapidly, take rate holding steady despite competitive pressure, and the company is marching toward profitability. The equity-only structure is appropriate for this stage — no need to introduce debt when the business is capital-light and growth is this strong. Conviction is highest in the portfolio.",
    keyRisks: [
      "Competitive pressure on take rates from larger players",
      "Regulatory licensing risk across multiple West African jurisdictions",
      "FX settlement risk on cross-border transactions",
    ],
    nextActions: [
      "Support Series B preparation — the growth story is compelling",
      "Monitor take rate compression as a leading indicator of competitive pressure",
      "Assess whether the company should enter Francophone West Africa",
    ],
  },
  mediroute: {
    thesis: "Last-mile pharma delivery in Nigeria addresses a real gap — pharmacies and clinics struggle with reliable, timely supply. The subscription model adds revenue predictability.",
    currentView: "Revenue is growing but the key concern is cost-per-delivery, which is not improving as expected. This suggests the logistics model isn't achieving the density/efficiency gains that were projected. Additionally, the convertible note matures in Q1-2026, creating near-term capital pressure. The company needs either a successful priced round or a note extension.",
    keyRisks: [
      "Cost-per-delivery not declining — questions unit economics at scale",
      "Convertible note maturity creates near-term financing pressure",
      "Nigerian logistics infrastructure challenges (fuel, roads, security)",
    ],
    nextActions: [
      "Negotiate convertible note extension or conversion terms",
      "Deep dive on delivery route optimisation — is technology or operations the bottleneck?",
      "Assess whether subscription revenue can be grown faster to improve blended unit economics",
    ],
  },
  edubridge: {
    thesis: "Vocational training with employer placement in Senegal — a model that aligns incentives (students pay for outcomes, employers get vetted talent). The concessional debt terms reduce capital cost.",
    currentView: "Steady growth with improving completion and placement rates. The placement commission revenue stream is scaling nicely and could become the dominant revenue source if the employer network continues to expand. The concessional debt is being serviced comfortably. This is a patient capital play — the returns will come from scale, not from margin expansion.",
    keyRisks: [
      "Student dropout risk if economic conditions make immediate employment more attractive than training",
      "Employer placement demand is cyclical — recession risk",
      "Course content relevance risk — vocational skills can become outdated quickly",
    ],
    nextActions: [
      "Expand employer partnership network — this is the growth lever",
      "Assess Francophone West Africa expansion (Ivory Coast, Mali)",
      "Develop outcome-based financing model to attract additional concessional capital",
    ],
  },
  aquaclean: {
    thesis: "Community water kiosks in Mozambique — essential service, predictable demand, proven unit economics at the kiosk level. Debt-appropriate business model.",
    currentView: "Kiosk-level economics are solid but expansion is significantly slower than planned. The company targeted 5 new kiosks per quarter and is achieving 2-3. This means debt service is consuming a larger share of cash flow than projected because the revenue base isn't growing fast enough to create headroom. The DSCR is declining and approaching watch territory. Not a crisis, but the trend needs to reverse.",
    keyRisks: [
      "Expansion pace below plan — debt service becomes heavier relative to revenue",
      "Mozambique country risk — currency, regulatory, political",
      "Water source risk — kiosk economics depend on water quality and availability",
    ],
    nextActions: [
      "Identify bottlenecks to kiosk deployment — is it capital, sites, or regulation?",
      "Model debt service coverage under current vs planned expansion pace",
      "Consider requesting principal repayment holiday to rebuild cash buffer",
    ],
  },
};

export default function CompanyInvestmentNote({
  company,
  latest,
}: CompanyInvestmentNoteProps) {
  const note = investmentNotes[company.id];
  if (!note) return null;

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-slate-300 mb-4">
        Investment Note — Portfolio Analyst View
      </h3>

      {/* Investment thesis */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          Investment Thesis
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">{note.thesis}</p>
      </div>

      {/* Current assessment */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          Current Assessment
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          {note.currentView}
        </p>
      </div>

      {/* Two-column: risks and actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Key Risks
          </p>
          <ul className="space-y-1.5">
            {note.keyRisks.map((risk, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Recommended Actions
          </p>
          <ul className="space-y-1.5">
            {note.nextActions.map((action, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conviction footer */}
      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Conviction Level:</span>
          <span
            className={`text-xs font-bold uppercase ${
              company.convictionLevel === "high"
                ? "text-emerald-400"
                : company.convictionLevel === "medium"
                  ? "text-amber-400"
                  : "text-red-400"
            }`}
          >
            {company.convictionLevel}
          </span>
        </div>
        <span className="text-[10px] text-slate-600 italic">
          Note: This is simulated analyst commentary for demonstration purposes
        </span>
      </div>
    </div>
  );
}
