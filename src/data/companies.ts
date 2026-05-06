/**
 * companies.ts
 *
 * Master company registry for Portfolio360.
 * Contains static metadata for all 10 portfolio companies.
 *
 * Finance types across the portfolio:
 *  - Pure equity (4 companies)
 *  - Pure debt (2 companies)
 *  - Blended / mixed (4 companies)
 *
 * Sectors: 3 Solar, 3 Agriculture, 4 Other (Fintech, HealthTech, EdTech, WASH)
 *
 * Status logic:
 *  - "healthy"  = on track, no major concerns
 *  - "watch"    = 1-2 metrics deteriorating, needs monitoring
 *  - "critical" = multiple thresholds breached, requires action
 */

export type CompanyStatus = "healthy" | "watch" | "critical";
export type FinanceType = "equity" | "debt" | "blended";
export type RiskLevel = "low" | "medium" | "high";

export interface Company {
  id: string;
  name: string;
  sector: string;
  sectorCategory: "solar" | "agriculture" | "fintech" | "healthtech" | "edtech" | "wash";
  stage: string;
  status: CompanyStatus;
  description: string;
  businessModel: string;
  financeType: FinanceType;
  financeDetail: string;
  capitalDeployed: number;         // total USD deployed
  equityInvested: number;          // equity portion
  debtOutstanding: number;         // current debt balance
  grantReceived: number;           // grant/concessional capital
  currency: "USD";
  country: string;
  foundedYear: number;
  riskLevel: RiskLevel;
  riskRationale: string;
  keyMetricLabel: string;          // the primary business-specific KPI label
  keyMetricUnit: string;           // e.g. "units", "%", "USD"
}

const companies: Company[] = [
  // ─── SOLAR (3) ──────────────────────────────────────────────
  {
    id: "kijanicold",
    name: "KijaniCold Ltd",
    sector: "Solar / Cold Chain",
    sectorCategory: "solar",
    stage: "Early Growth",
    status: "healthy",
    description: "Solar-powered cold storage units leased to SME food retailers across Kenya. Asset-heavy recurring revenue model with 7-year unit life.",
    businessModel: "Asset leasing -fixed monthly lease + variable usage fees",
    financeType: "equity",
    financeDetail: "Series Seed -two equity rounds totalling $600K",
    capitalDeployed: 600000,
    equityInvested: 600000,
    debtOutstanding: 0,
    grantReceived: 0,
    currency: "USD",
    country: "Kenya",
    foundedYear: 2022,
    riskLevel: "low",
    riskRationale: "Strong unit economics improving QoQ, clear path to EBITDA breakeven, seasonal demand well-understood. Churn improving in April.",
    keyMetricLabel: "Units Deployed",
    keyMetricUnit: "units",
  },
  {
    id: "sungrid",
    name: "SunGrid Energy",
    sector: "Solar / Mini-Grid",
    sectorCategory: "solar",
    stage: "Growth",
    status: "watch",
    description: "Develops and operates solar mini-grids serving rural communities and commercial clusters in Kenya. Revenue from connection fees and per-kWh tariffs.",
    businessModel: "Infrastructure utility -connection fees + metered energy sales",
    financeType: "blended",
    financeDetail: "Equity $800K + USAID grant $400K for grid buildout",
    capitalDeployed: 1200000,
    equityInvested: 800000,
    debtOutstanding: 0,
    grantReceived: 400000,
    currency: "USD",
    country: "Kenya",
    foundedYear: 2021,
    riskLevel: "medium",
    riskRationale: "Solid asset base but tariff collections still below target at 87%. Grant runway provides buffer but commercial sustainability not yet proven.",
    keyMetricLabel: "Connections",
    keyMetricUnit: "connections",
  },
  {
    id: "brightstore",
    name: "BrightStore Solar",
    sector: "Solar / Pay-As-You-Go",
    sectorCategory: "solar",
    stage: "Scaling",
    status: "healthy",
    description: "Distributes solar home systems on a pay-as-you-go (PAYG) basis to off-grid households in Kenya. Revenue from daily mobile money micropayments over 24-month contracts.",
    businessModel: "PAYG asset finance -daily micropayments via mobile money",
    financeType: "debt",
    financeDetail: "Asset-backed facility $1.5M from impact lender, secured against PAYG receivables",
    capitalDeployed: 1500000,
    equityInvested: 0,
    debtOutstanding: 980000,
    grantReceived: 0,
    currency: "USD",
    country: "Kenya",
    foundedYear: 2020,
    riskLevel: "low",
    riskRationale: "Proven unit economics, repayment rates above 92%, distribution network scaling well. PAR30 ticking up to 9.4% - worth monitoring.",
    keyMetricLabel: "Active PAYG Customers",
    keyMetricUnit: "customers",
  },

  // ─── AGRICULTURE (3) ────────────────────────────────────────
  {
    id: "harvestfin",
    name: "HarvestFin",
    sector: "Agri-Fintech / Lending",
    sectorCategory: "agriculture",
    stage: "Growth",
    status: "watch",
    description: "Provides digital crop loans to smallholder farmers in Kenya via mobile, using satellite imagery and farm-level data for credit scoring.",
    businessModel: "Digital lending -interest income on short-cycle crop loans",
    financeType: "equity",
    financeDetail: "Series A equity -$1.2M from impact VC fund",
    capitalDeployed: 1200000,
    equityInvested: 1200000,
    debtOutstanding: 0,
    grantReceived: 0,
    currency: "USD",
    country: "Kenya",
    foundedYear: 2021,
    riskLevel: "medium",
    riskRationale: "PAR30 now at 7.9% and rising for three consecutive quarters. Revenue growth solid but credit quality deterioration needs active management.",
    keyMetricLabel: "Active Loans",
    keyMetricUnit: "loans",
  },
  {
    id: "greenbasket",
    name: "GreenBasket",
    sector: "Ag / Supply Chain",
    sectorCategory: "agriculture",
    stage: "Early Growth",
    status: "critical",
    description: "Aggregates fresh produce from smallholder cooperatives and supplies urban retailers and restaurants in Nairobi. Uses cold logistics and grading tech.",
    businessModel: "Supply chain intermediary -margin on produce traded",
    financeType: "blended",
    financeDetail: "Equity $500K + working capital facility $300K from local bank",
    capitalDeployed: 800000,
    equityInvested: 500000,
    debtOutstanding: 280000,
    grantReceived: 0,
    currency: "USD",
    country: "Kenya",
    foundedYear: 2022,
    riskLevel: "high",
    riskRationale: "Gross margin at 12.8%, debt covenant in breach, receivable days worsening to 58. Working capital spiral accelerating. Operational turnaround or equity injection required urgently.",
    keyMetricLabel: "MT Traded",
    keyMetricUnit: "metric tonnes",
  },
  {
    id: "farmflow",
    name: "FarmFlow",
    sector: "Ag / Irrigation-as-a-Service",
    sectorCategory: "agriculture",
    stage: "Pilot → Growth",
    status: "watch",
    description: "Deploys solar-powered drip irrigation systems to commercial farms in Ethiopia on a service contract basis. Revenue from seasonal service fees and water metering.",
    businessModel: "Service contracts -seasonal irrigation fees + water usage charges",
    financeType: "debt",
    financeDetail: "Project finance facility $900K from DFI, secured against service contracts",
    capitalDeployed: 900000,
    equityInvested: 0,
    debtOutstanding: 720000,
    grantReceived: 0,
    currency: "USD",
    country: "Ethiopia",
    foundedYear: 2021,
    riskLevel: "medium",
    riskRationale: "DSCR has weakened from 1.8x to 0.41x during the seasonal transition in April. Revenue softening as high-demand season ends. Debt service pressure increasing - needs close monitoring.",
    keyMetricLabel: "Hectares Serviced",
    keyMetricUnit: "hectares",
  },

  // ─── FINTECH (1) ────────────────────────────────────────────
  {
    id: "payswift",
    name: "PaySwift",
    sector: "Fintech / Payments",
    sectorCategory: "fintech",
    stage: "Scaling",
    status: "healthy",
    description: "B2B payment processing platform for SMEs in Kenya, enabling cross-border payments and FX settlement across East Africa.",
    businessModel: "Transaction fees -percentage of TPV processed",
    financeType: "equity",
    financeDetail: "Series A -$2M from fintech-focused VC",
    capitalDeployed: 2000000,
    equityInvested: 2000000,
    debtOutstanding: 0,
    grantReceived: 0,
    currency: "USD",
    country: "Kenya",
    foundedYear: 2020,
    riskLevel: "low",
    riskRationale: "Fastest revenue growth in portfolio, TPV at $8.7M and scaling. Take rate stable at 1.63%, 1,268 active merchants. Path to profitability clear by Q3-26.",
    keyMetricLabel: "TPV Processed",
    keyMetricUnit: "USD",
  },

  // ─── HEALTHTECH (1) ─────────────────────────────────────────
  {
    id: "mediroute",
    name: "MediRoute",
    sector: "HealthTech / Last-Mile Pharma",
    sectorCategory: "healthtech",
    stage: "Growth",
    status: "critical",
    description: "Last-mile pharmaceutical delivery network in Nigeria, connecting pharmacies and clinics to wholesale distributors via an optimised logistics platform.",
    businessModel: "Delivery fee per consignment + subscription for priority routing",
    financeType: "blended",
    financeDetail: "Equity $700K + convertible note $300K from angel syndicate",
    capitalDeployed: 1000000,
    equityInvested: 700000,
    debtOutstanding: 300000,
    grantReceived: 0,
    currency: "USD",
    country: "Nigeria",
    foundedYear: 2021,
    riskLevel: "high",
    riskRationale: "Convertible note of $302K matured in Q2-26 and remains unresolved. Cost-per-delivery rose to $3.08 in April. EBITDA margin declining. Refinancing discussions ongoing but outcome uncertain.",
    keyMetricLabel: "Monthly Deliveries",
    keyMetricUnit: "deliveries",
  },

  // ─── EDTECH (1) ─────────────────────────────────────────────
  {
    id: "edubridge",
    name: "EduBridge",
    sector: "EdTech / Vocational Training",
    sectorCategory: "edtech",
    stage: "Early Growth",
    status: "watch",
    description: "Online and hybrid vocational training platform in Senegal, offering certified courses in tech, trades and agribusiness with employer placement partnerships.",
    businessModel: "Course fees + employer placement commissions",
    financeType: "blended",
    financeDetail: "Equity $400K + concessional loan $200K from social enterprise fund",
    capitalDeployed: 600000,
    equityInvested: 400000,
    debtOutstanding: 150000,
    grantReceived: 0,
    currency: "USD",
    country: "Senegal",
    foundedYear: 2022,
    riskLevel: "medium",
    riskRationale: "New enrollment slowing in Q2 inter-cohort period. DSCR at 0.18x is very thin. Placement revenue growing but not yet enough to cover debt service comfortably.",
    keyMetricLabel: "Active Students",
    keyMetricUnit: "students",
  },

  // ─── WASH (1) ───────────────────────────────────────────────
  {
    id: "aquaclean",
    name: "AquaClean",
    sector: "Water / WASH",
    sectorCategory: "wash",
    stage: "Growth",
    status: "watch",
    description: "Builds and operates community water purification kiosks in peri-urban Mozambique, selling treated water at affordable per-litre pricing via mobile payments.",
    businessModel: "Water sales -per-litre pricing via mobile money kiosks",
    financeType: "debt",
    financeDetail: "Working capital facility $500K from microfinance institution",
    capitalDeployed: 500000,
    equityInvested: 0,
    debtOutstanding: 420000,
    grantReceived: 0,
    currency: "USD",
    country: "Mozambique",
    foundedYear: 2021,
    riskLevel: "medium",
    riskRationale: "Kiosk count stalled at 35 for second consecutive month. Negative DSCR and cash balance flag structural debt service risk. Expansion plan needs revisiting.",
    keyMetricLabel: "Active Kiosks",
    keyMetricUnit: "kiosks",
  },
];

export default companies;
