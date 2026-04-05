"""
generate-data.py

Generates 27 months of realistic dummy financial data for 10 portfolio companies.
Period: Jan-2024 (Q1-2024) through Mar-2026 (Q1-2026).

Each company has different:
  - Revenue trajectories (growth, plateau, decline patterns)
  - Margin profiles (expanding, stable, compressing)
  - Cash dynamics (burn rates, runway implications)
  - Business-specific KPIs
  - Debt/equity metrics where applicable
  - Seasonal patterns appropriate to sector

The data is designed to tell a portfolio story:
  - 3 companies clearly healthy
  - 3 on watch (deteriorating but not yet critical)
  - 1 critical (multiple red flags)
  - 3 mixed / transitioning

This creates a realistic portfolio where not everything is alarm
and not everything is green — the kind of portfolio that requires
actual analytical judgement to manage.
"""

import json
import math
import os
import random

random.seed(42)  # Reproducible

# ─── HELPERS ─────────────────────────────────────────────────────

def months_range():
    """Generate 27 month labels: Jan-2024 through Mar-2026."""
    months = []
    for year in [2024, 2025, 2026]:
        end_month = 3 if year == 2026 else 12
        for m in range(1, end_month + 1):
            months.append(f"{year}-{m:02d}")
    return months

MONTHS = months_range()

def quarter_for(period):
    """Convert '2024-01' to 'Q1-2024'."""
    y, m = period.split("-")
    q = (int(m) - 1) // 3 + 1
    return f"Q{q}-{y}"

def add_noise(val, pct=0.03):
    """Add small random noise to a value (default ±3%)."""
    return val * (1 + random.uniform(-pct, pct))

def seasonal_factor(month_idx, amplitude=0.08, peak_month=11):
    """
    Sinusoidal seasonal pattern.
    peak_month=11 means December peak (0-indexed from Jan).
    amplitude=0.08 means ±8% swing.
    """
    phase = 2 * math.pi * (month_idx - peak_month) / 12
    return 1 + amplitude * math.cos(phase)

def ag_seasonal(month_idx):
    """Agriculture: peaks during harvest (Mar-Apr, Oct-Nov), troughs mid-year."""
    # Two harvest peaks per year
    m = month_idx % 12
    if m in [2, 3]:      return 1.15  # Mar-Apr harvest
    elif m in [9, 10]:   return 1.12  # Oct-Nov harvest
    elif m in [5, 6, 7]: return 0.85  # Mid-year trough
    else:                return 1.0

def clamp(val, lo=0, hi=None):
    if hi is not None:
        return max(lo, min(hi, val))
    return max(lo, val)

# ─── COMPANY DATA GENERATORS ────────────────────────────────────

def gen_kijanicold():
    """
    KijaniCold — Solar Cold Chain (Equity, Healthy)
    Story: Steady unit deployment, improving unit economics, approaching breakeven.
    """
    data = []
    units = 18   # starting deployed units Jan 2024
    cash = 280000

    for i, period in enumerate(MONTHS):
        month_in_year = int(period.split("-")[1])

        # Unit growth: 2/month in 2024, 3/month in 2025-26
        deploy_rate = 2 if i < 12 else 3
        churn = max(0, round(units * 0.025))
        new_units = deploy_rate
        units = units + new_units - churn

        # Revenue per unit improves over time
        rev_per_unit = 180 + i * 2.5
        seasonal = seasonal_factor(month_in_year - 1, 0.10, 11)
        revenue = units * rev_per_unit * seasonal
        revenue = add_noise(revenue)

        # Margins improving
        gross_margin = clamp(0.78 + i * 0.002, hi=0.86)
        gross_profit = revenue * gross_margin

        # Opex: semi-fixed with step increases
        opex = 2800 + (i // 6) * 400 + units * 22
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        # Depreciation
        depreciation = units * 180 / (7 * 12)  # straight-line 7yr life
        net_income = ebitda - depreciation

        # Cash: equity injection at month 0 and month 12
        equity_in = 300000 if i == 0 else (300000 if i == 12 else 0)
        capex = new_units * 5000
        cash = cash + net_income + depreciation - capex + equity_in

        burn = net_income + depreciation - capex

        # Utilisation
        utilisation = clamp(0.68 + i * 0.005 + random.uniform(-0.03, 0.03), hi=0.92)

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            # Business-specific
            "unitsDeployed": units,
            "utilisation": round(utilisation, 3),
            "churnRate": round(churn / max(units, 1), 3),
            "revenuePerUnit": round(rev_per_unit * seasonal),
            "contributionMargin": round(gross_margin - 0.05, 3),  # after direct costs
            "paybackMonths": round(5000 / max(ebitda / max(units, 1), 1), 1),
            "capex": round(capex),
            # Debt metrics (equity-only company, still track)
            "debtOutstanding": 0,
            "debtService": 0,
            "dscr": None,
        })
    return data


def gen_sungrid():
    """
    SunGrid Energy — Solar Mini-Grid (Blended: Equity + Grant, Watch)
    Story: Solid asset build but collection rates deteriorating in recent quarters.
    """
    data = []
    connections = 420
    cash = 350000

    for i, period in enumerate(MONTHS):
        # Connection growth slowing
        new_conn = max(8, int(18 - i * 0.4 + random.uniform(-2, 2)))
        connections += new_conn

        # Revenue: connection fees + tariff income
        tariff_per_conn = 12.5 + i * 0.15
        connection_fee_rev = new_conn * 85
        tariff_rev = connections * tariff_per_conn * seasonal_factor(int(period.split("-")[1]) - 1, 0.06, 0)

        # Collection rate deteriorating from Q4-2025
        collection_rate = 0.94 if i < 20 else clamp(0.94 - (i - 20) * 0.015, lo=0.82)
        revenue = (connection_fee_rev + tariff_rev) * collection_rate
        revenue = add_noise(revenue)

        gross_margin = clamp(0.62 - (0.002 if i > 18 else 0) * (i - 18), lo=0.52)
        gross_profit = revenue * gross_margin

        opex = 3200 + connections * 3.5
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = connections * 200 / (15 * 12)
        net_income = ebitda - depreciation

        # Grant drawdown in first 12 months
        grant_in = 33000 if i < 12 else 0
        capex = new_conn * 650
        cash = cash + net_income + depreciation - capex + grant_in
        burn = net_income + depreciation - capex + grant_in

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "connections": connections,
            "newConnections": new_conn,
            "collectionRate": round(collection_rate, 3),
            "tariffPerConnection": round(tariff_per_conn, 2),
            "kwhSold": round(connections * 45 * seasonal_factor(int(period.split("-")[1]) - 1, 0.1, 0)),
            "capex": round(capex),
            "debtOutstanding": 0,
            "debtService": 0,
            "dscr": None,
            "grantRemaining": round(max(0, 400000 - grant_in * (i + 1))),
        })
    return data


def gen_brightstore():
    """
    BrightStore Solar — PAYG Solar (Debt-financed, Healthy)
    Story: Strong repayment rates, scaling well, debt service comfortable.
    """
    data = []
    customers = 2200
    cash = 180000
    debt = 1400000

    for i, period in enumerate(MONTHS):
        new_cust = int(95 + i * 3 + random.uniform(-10, 10))
        churn = int(customers * 0.012)
        customers = customers + new_cust - churn

        # PAYG revenue: daily payments
        rev_per_customer = 8.5 + i * 0.08
        repayment_rate = clamp(0.91 + i * 0.001 + random.uniform(-0.01, 0.01), hi=0.96)
        revenue = customers * rev_per_customer * repayment_rate
        revenue = add_noise(revenue)

        gross_margin = clamp(0.55 + i * 0.003, hi=0.68)
        gross_profit = revenue * gross_margin

        opex = 4500 + customers * 0.8
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = customers * 45 / (3 * 12)
        net_income = ebitda - depreciation

        # Debt service: monthly principal + interest
        monthly_principal = 1400000 / 48  # 4-year term
        interest = debt * 0.12 / 12
        debt_service = monthly_principal + interest
        debt = max(0, debt - monthly_principal)

        capex = new_cust * 32
        cash = cash + net_income + depreciation - capex - debt_service
        burn = net_income + depreciation - capex - debt_service

        dscr = ebitda / debt_service if debt_service > 0 else None

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "activeCustomers": customers,
            "newCustomers": new_cust,
            "customerChurn": churn,
            "repaymentRate": round(repayment_rate, 3),
            "revenuePerCustomer": round(rev_per_customer, 2),
            "capex": round(capex),
            "debtOutstanding": round(debt),
            "debtService": round(debt_service),
            "dscr": round(dscr, 2) if dscr else None,
            "par30": round(clamp(1 - repayment_rate + 0.02 + random.uniform(-0.005, 0.005), lo=0.02, hi=0.12), 3),
        })
    return data


def gen_harvestfin():
    """
    HarvestFin — Agri-Fintech Lending (Equity, Watch)
    Story: Revenue growing but PAR30 rising — credit quality deteriorating.
    """
    data = []
    active_loans = 1800
    cash = 420000
    loan_book = 850000

    for i, period in enumerate(MONTHS):
        month = int(period.split("-")[1])
        seasonal = ag_seasonal(month - 1)

        # Disbursements seasonal
        new_loans = int((180 + i * 5) * seasonal + random.uniform(-15, 15))
        repaid = int(active_loans * 0.12)  # ~12% mature each month
        defaults = int(active_loans * (0.003 + max(0, i - 14) * 0.001))  # defaults rising after month 14
        active_loans = active_loans + new_loans - repaid - defaults

        # Interest income
        avg_loan_size = 420 + i * 5
        interest_rate_monthly = 0.035
        loan_book = active_loans * avg_loan_size
        revenue = loan_book * interest_rate_monthly * seasonal
        revenue = add_noise(revenue)

        # PAR30 deteriorating from mid-2025
        par30 = clamp(0.035 + max(0, i - 14) * 0.003 + random.uniform(-0.005, 0.005), lo=0.02, hi=0.12)

        # Provision expense rising with PAR
        provision_rate = par30 * 0.5
        gross_margin = clamp(0.82 - provision_rate, lo=0.60)
        gross_profit = revenue * gross_margin

        opex = 6200 + active_loans * 1.2
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = 800
        net_income = ebitda - depreciation

        equity_in = 600000 if i == 0 else (600000 if i == 15 else 0)
        cash = cash + net_income + depreciation + equity_in
        burn = net_income + depreciation

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "activeLoans": active_loans,
            "newDisbursements": new_loans,
            "loanBook": round(loan_book),
            "par30": round(par30, 3),
            "defaultRate": round(defaults / max(active_loans, 1), 4),
            "avgLoanSize": round(avg_loan_size),
            "yieldOnBook": round(interest_rate_monthly * 12, 3),
            "provisionRate": round(provision_rate, 3),
            "capex": 0,
            "debtOutstanding": 0,
            "debtService": 0,
            "dscr": None,
        })
    return data


def gen_greenbasket():
    """
    GreenBasket — Ag Supply Chain (Blended: Equity + WC Debt, Critical)
    Story: Margins compressing, working capital ballooning, debt covenant pressure.
    """
    data = []
    mt_traded = 120  # metric tonnes per month
    cash = 95000
    debt = 280000

    for i, period in enumerate(MONTHS):
        month = int(period.split("-")[1])
        seasonal = ag_seasonal(month - 1)

        # Volume growing but margin compressing
        mt_traded = mt_traded + random.uniform(-5, 12) * seasonal
        mt_traded = max(80, mt_traded)

        price_per_mt = 380 + i * 2 - max(0, i - 15) * 4  # price pressure from month 15
        revenue = mt_traded * price_per_mt * seasonal
        revenue = add_noise(revenue)

        # Gross margin compressing — the core problem
        gross_margin = clamp(0.22 - max(0, i - 10) * 0.005 + random.uniform(-0.01, 0.01), lo=0.08, hi=0.25)
        gross_profit = revenue * gross_margin

        opex = 5500 + mt_traded * 8
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = 1200
        net_income = ebitda - depreciation

        # Debt service
        interest = debt * 0.14 / 12
        principal = 280000 / 36
        debt_service = interest + principal
        debt = max(0, debt - principal)

        # Working capital getting worse
        receivable_days = 35 + max(0, i - 12) * 1.5
        wc_intensity = receivable_days / 30 * revenue / 30

        equity_in = 250000 if i == 0 else (250000 if i == 10 else 0)
        cash = cash + net_income + depreciation - debt_service - wc_intensity * 0.05 + equity_in
        burn = net_income + depreciation - debt_service

        dscr = ebitda / debt_service if debt_service > 0 else None

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else max(1, round(cash / max(abs(burn), 1), 1)),
            "mtTraded": round(mt_traded, 1),
            "pricePerMT": round(price_per_mt),
            "receivableDays": round(receivable_days, 1),
            "wcIntensity": round(wc_intensity),
            "capex": 0,
            "debtOutstanding": round(debt),
            "debtService": round(debt_service),
            "dscr": round(dscr, 2) if dscr else None,
            "covenantStatus": "breach" if (dscr and dscr < 1.2) else ("watch" if (dscr and dscr < 1.5) else "ok"),
        })
    return data


def gen_farmflow():
    """
    FarmFlow — Irrigation-as-a-Service (Debt, Healthy)
    Story: Seasonal but predictable, strong DSCR, expanding acreage.
    """
    data = []
    hectares = 340
    cash = 120000
    debt = 720000

    for i, period in enumerate(MONTHS):
        month = int(period.split("-")[1])
        # Irrigation is very seasonal: peak in dry months (Jan-Mar, Oct-Dec)
        if month in [1, 2, 3, 10, 11, 12]:
            seasonal = 1.3
        elif month in [4, 9]:
            seasonal = 0.9
        else:
            seasonal = 0.5  # rainy season = low demand

        # Hectares expand in steps
        if i % 6 == 0 and i > 0:
            hectares += int(40 + random.uniform(-5, 10))

        rev_per_hectare = (28 + i * 0.3) * seasonal
        revenue = hectares * rev_per_hectare
        revenue = add_noise(revenue)

        gross_margin = clamp(0.58 + i * 0.002 + random.uniform(-0.02, 0.02), hi=0.70)
        gross_profit = revenue * gross_margin

        opex = 2800 + hectares * 3
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = hectares * 120 / (10 * 12)
        net_income = ebitda - depreciation

        # Debt service matched to seasonal revenue
        base_principal = 720000 / 60  # 5-year term
        interest = debt * 0.105 / 12
        # Principal holiday in low season
        principal = base_principal * (1.5 if seasonal > 1 else 0.3)
        debt_service = principal + interest
        debt = max(0, debt - principal)

        capex = 0 if i % 6 != 0 else int(hectares * 15)
        cash = cash + net_income + depreciation - debt_service - capex
        burn = net_income + depreciation - debt_service - capex

        dscr = ebitda / debt_service if debt_service > 0 else None

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "hectaresServiced": hectares,
            "revenuePerHectare": round(rev_per_hectare, 2),
            "seasonalDemand": "high" if seasonal > 1 else ("medium" if seasonal > 0.7 else "low"),
            "capex": round(capex),
            "debtOutstanding": round(debt),
            "debtService": round(debt_service),
            "dscr": round(dscr, 2) if dscr else None,
        })
    return data


def gen_payswift():
    """
    PaySwift — Fintech Payments (Equity, Healthy)
    Story: Fastest growing company. TPV scaling, take rate stable, marching to profitability.
    """
    data = []
    merchants = 380
    cash = 850000
    tpv = 1200000

    for i, period in enumerate(MONTHS):
        new_merchants = int(22 + i * 1.5 + random.uniform(-5, 5))
        churn = int(merchants * 0.015)
        merchants = merchants + new_merchants - churn

        # TPV growing faster than merchant count (more volume per merchant)
        tpv_per_merchant = 3200 + i * 120 + random.uniform(-200, 200)
        tpv = merchants * tpv_per_merchant

        take_rate = clamp(0.018 - i * 0.00005 + random.uniform(-0.0005, 0.0005), lo=0.014)
        revenue = tpv * take_rate
        revenue = add_noise(revenue)

        gross_margin = clamp(0.72 + i * 0.002, hi=0.82)
        gross_profit = revenue * gross_margin

        opex = 12000 + merchants * 4
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = 2500
        net_income = ebitda - depreciation

        equity_in = 1000000 if i == 0 else (1000000 if i == 14 else 0)
        cash = cash + net_income + depreciation + equity_in
        burn = net_income + depreciation

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "activeMerchants": merchants,
            "newMerchants": new_merchants,
            "merchantChurn": churn,
            "tpv": round(tpv),
            "takeRate": round(take_rate, 4),
            "tpvPerMerchant": round(tpv_per_merchant),
            "capex": 0,
            "debtOutstanding": 0,
            "debtService": 0,
            "dscr": None,
        })
    return data


def gen_mediroute():
    """
    MediRoute — HealthTech Last-Mile Pharma (Blended: Equity + Conv Note, Watch)
    Story: Revenue growing but cost-per-delivery stubbornly high. Conv note maturity approaching.
    """
    data = []
    deliveries = 4200
    cash = 280000
    conv_note = 300000

    for i, period in enumerate(MONTHS):
        growth = max(0.02, 0.08 - i * 0.002)
        new_del = int(deliveries * growth + random.uniform(-100, 100))
        deliveries += new_del

        rev_per_delivery = 3.8 + i * 0.04
        revenue = deliveries * rev_per_delivery
        revenue = add_noise(revenue)

        # Cost per delivery NOT improving as fast as hoped
        cost_per_delivery = 2.6 + i * 0.015  # should be declining but isn't
        cogs = deliveries * cost_per_delivery
        gross_profit = revenue - cogs
        gross_margin = gross_profit / revenue if revenue > 0 else 0

        opex = 5800 + deliveries * 0.3
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = 1500
        net_income = ebitda - depreciation

        # Convertible note accruing interest, maturity at month 27 (Q1-2026)
        conv_interest = conv_note * 0.08 / 12
        conv_note_balance = conv_note + conv_interest if i < 27 else 0

        equity_in = 350000 if i == 0 else (350000 if i == 12 else 0)
        cash = cash + net_income + depreciation + equity_in
        burn = net_income + depreciation

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "monthlyDeliveries": deliveries,
            "revenuePerDelivery": round(rev_per_delivery, 2),
            "costPerDelivery": round(cost_per_delivery, 2),
            "deliveryGrowthRate": round(growth, 3),
            "subscriptionRevPct": round(clamp(0.15 + i * 0.005, hi=0.35), 3),
            "capex": 0,
            "debtOutstanding": round(conv_note_balance),
            "debtService": round(conv_interest),
            "dscr": round(ebitda / max(conv_interest, 1), 2) if conv_interest > 0 else None,
            "convNoteMaturityMonths": max(0, 27 - i),
        })
    return data


def gen_edubridge():
    """
    EduBridge — EdTech Vocational (Blended: Equity + Concessional, Healthy)
    Story: Growing steadily, placement revenue starting to contribute, concessional debt manageable.
    """
    data = []
    students = 450
    cash = 180000
    debt = 200000

    for i, period in enumerate(MONTHS):
        month = int(period.split("-")[1])
        # Enrollment is seasonal: peaks Jan, Apr, Sep
        enroll_seasonal = 1.4 if month in [1, 4, 9] else (0.7 if month in [6, 7, 12] else 1.0)

        new_students = int((35 + i * 1.5) * enroll_seasonal + random.uniform(-8, 8))
        graduates = int(students * 0.08)
        dropouts = int(students * 0.03)
        students = students + new_students - graduates - dropouts

        # Revenue: course fees + placement commissions
        course_fee = 42 + i * 0.5
        course_rev = students * course_fee / 6  # 6-month average course
        placement_rev = graduates * 120 * clamp(0.35 + i * 0.01, hi=0.65)  # placement rate improving
        revenue = course_rev + placement_rev
        revenue = add_noise(revenue)

        gross_margin = clamp(0.60 + i * 0.003, hi=0.75)
        gross_profit = revenue * gross_margin

        opex = 3800 + students * 2.5
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = 600
        net_income = ebitda - depreciation

        # Concessional debt: low rate, long term
        interest = debt * 0.05 / 12
        principal = 200000 / 60  # 5-year
        debt_service = interest + principal
        debt = max(0, debt - principal)

        equity_in = 200000 if i == 0 else (200000 if i == 16 else 0)
        cash = cash + net_income + depreciation - debt_service + equity_in
        burn = net_income + depreciation - debt_service

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else 99,
            "activeStudents": students,
            "newEnrollments": new_students,
            "graduates": graduates,
            "completionRate": round(clamp(0.72 + i * 0.003 + random.uniform(-0.02, 0.02), hi=0.88), 3),
            "placementRate": round(clamp(0.35 + i * 0.01, hi=0.65), 3),
            "revenuePerStudent": round(revenue / max(students, 1)),
            "capex": 0,
            "debtOutstanding": round(debt),
            "debtService": round(debt_service),
            "dscr": round(ebitda / max(debt_service, 1), 2) if debt_service > 0 else None,
        })
    return data


def gen_aquaclean():
    """
    AquaClean — Water/WASH (Debt, Watch)
    Story: Kiosk economics solid but expansion slower than plan. Debt service squeezing cash.
    """
    data = []
    kiosks = 28
    cash = 85000
    debt = 420000

    for i, period in enumerate(MONTHS):
        # Expansion slower than planned
        if i % 4 == 0 and i > 0:
            kiosks += max(1, int(3 - i * 0.08 + random.uniform(-1, 1)))

        litres_per_kiosk = 8500 + i * 50 + random.uniform(-300, 300)
        price_per_litre = 0.005
        revenue = kiosks * litres_per_kiosk * price_per_litre
        revenue = add_noise(revenue)

        gross_margin = clamp(0.52 + i * 0.002 + random.uniform(-0.02, 0.02), hi=0.62)
        gross_profit = revenue * gross_margin

        opex = 1800 + kiosks * 12
        ebitda = gross_profit - opex
        ebitda_margin = ebitda / revenue if revenue > 0 else 0

        depreciation = kiosks * 800 / (8 * 12)
        net_income = ebitda - depreciation

        # Debt: working capital facility
        interest = debt * 0.16 / 12
        principal = 420000 / 42
        debt_service = interest + principal
        debt = max(0, debt - principal)

        capex = 0 if i % 4 != 0 else kiosks * 50
        cash = cash + net_income + depreciation - debt_service - capex
        burn = net_income + depreciation - debt_service - capex

        dscr = ebitda / debt_service if debt_service > 0 else None

        data.append({
            "period": period,
            "revenue": round(revenue),
            "grossProfit": round(gross_profit),
            "grossMargin": round(gross_margin, 3),
            "ebitda": round(ebitda),
            "ebitdaMargin": round(ebitda_margin, 3),
            "netIncome": round(net_income),
            "cashBalance": round(cash),
            "burnRate": round(burn),
            "runway": round(cash / max(abs(burn), 1), 1) if burn < 0 else max(1, round(cash / max(abs(burn), 1), 1)),
            "activeKiosks": kiosks,
            "litresPerKiosk": round(litres_per_kiosk),
            "pricePerLitre": price_per_litre,
            "capex": round(capex),
            "debtOutstanding": round(debt),
            "debtService": round(debt_service),
            "dscr": round(dscr, 2) if dscr else None,
        })
    return data


# ─── AGGREGATE AND WRITE ────────────────────────────────────────

def compute_quarterly(monthly_data):
    """Roll monthly data up to quarterly aggregates."""
    quarters = {}
    for m in monthly_data:
        q = quarter_for(m["period"])
        if q not in quarters:
            quarters[q] = {
                "period": q,
                "months": [],
                "revenue": 0,
                "grossProfit": 0,
                "ebitda": 0,
                "netIncome": 0,
                "capex": 0,
                "debtService": 0,
            }
        quarters[q]["months"].append(m["period"])
        quarters[q]["revenue"] += m["revenue"]
        quarters[q]["grossProfit"] += m["grossProfit"]
        quarters[q]["ebitda"] += m["ebitda"]
        quarters[q]["netIncome"] += m["netIncome"]
        quarters[q]["capex"] += m.get("capex", 0)
        quarters[q]["debtService"] += m.get("debtService", 0)

    result = []
    for q_key in sorted(quarters.keys()):
        q = quarters[q_key]
        last_month = monthly_data[[m["period"] for m in monthly_data].index(q["months"][-1])]
        q["grossMargin"] = round(q["grossProfit"] / max(q["revenue"], 1), 3)
        q["ebitdaMargin"] = round(q["ebitda"] / max(q["revenue"], 1), 3)
        q["cashBalance"] = last_month["cashBalance"]
        q["burnRate"] = last_month["burnRate"]
        q["runway"] = last_month.get("runway", 99)
        q["debtOutstanding"] = last_month.get("debtOutstanding", 0)
        q["dscr"] = last_month.get("dscr")
        del q["months"]
        result.append(q)
    return result


def compute_annual(quarterly_data):
    """Roll quarterly data up to annual aggregates."""
    years = {}
    for q in quarterly_data:
        year = q["period"].split("-")[1]
        if year not in years:
            years[year] = {
                "period": year,
                "revenue": 0,
                "grossProfit": 0,
                "ebitda": 0,
                "netIncome": 0,
                "capex": 0,
                "debtService": 0,
            }
        years[year]["revenue"] += q["revenue"]
        years[year]["grossProfit"] += q["grossProfit"]
        years[year]["ebitda"] += q["ebitda"]
        years[year]["netIncome"] += q["netIncome"]
        years[year]["capex"] += q.get("capex", 0)
        years[year]["debtService"] += q.get("debtService", 0)

    result = []
    for y_key in sorted(years.keys()):
        y = years[y_key]
        y["grossMargin"] = round(y["grossProfit"] / max(y["revenue"], 1), 3)
        y["ebitdaMargin"] = round(y["ebitda"] / max(y["revenue"], 1), 3)

        # Get last quarter's ending values for this year
        year_quarters = [q for q in quarterly_data if q["period"].endswith(y_key)]
        if year_quarters:
            last_q = year_quarters[-1]
            y["cashBalance"] = last_q["cashBalance"]
            y["debtOutstanding"] = last_q.get("debtOutstanding", 0)
            y["dscr"] = last_q.get("dscr")
        result.append(y)
    return result


def main():
    generators = {
        "kijanicold": gen_kijanicold,
        "sungrid": gen_sungrid,
        "brightstore": gen_brightstore,
        "harvestfin": gen_harvestfin,
        "greenbasket": gen_greenbasket,
        "farmflow": gen_farmflow,
        "payswift": gen_payswift,
        "mediroute": gen_mediroute,
        "edubridge": gen_edubridge,
        "aquaclean": gen_aquaclean,
    }

    output_dir = os.path.join(os.path.dirname(__file__), "..", "src", "data", "metrics")
    os.makedirs(output_dir, exist_ok=True)

    all_company_data = {}

    for company_id, gen_fn in generators.items():
        print(f"Generating data for {company_id}...")
        monthly = gen_fn()
        quarterly = compute_quarterly(monthly)
        annual = compute_annual(quarterly)

        company_data = {
            "companyId": company_id,
            "monthly": monthly,
            "quarterly": quarterly,
            "annual": annual,
        }

        # Write individual company file
        filepath = os.path.join(output_dir, f"{company_id}.json")
        with open(filepath, "w") as f:
            json.dump(company_data, f, indent=2)

        all_company_data[company_id] = company_data
        print(f"  → {len(monthly)} months, {len(quarterly)} quarters, {len(annual)} years")

    # Write combined metrics file for easy import
    combined_path = os.path.join(output_dir, "_all.json")
    with open(combined_path, "w") as f:
        json.dump(all_company_data, f, indent=2)

    print(f"\nAll data written to {output_dir}")
    print(f"Combined file: {combined_path}")


if __name__ == "__main__":
    main()
