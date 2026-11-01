
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../../lib/config";

import {
    FileText,
    ArrowUpRight,
    Download,
    ShieldAlert,
} from "lucide-react";

import {
    getAssessment,
    type SavedAssessment,
} from "../../lib/assessmentStorage";

// Historical data returned by FastAPI
type CreditBand = {
    band: string;
    mortgages: number;
    serious_cases: number;
    delinquency_rate: number;
};

// Format money in US dollars
function money(value: number) {
    if (!Number.isFinite(value)) {
        return "Not available";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

// Identify the borrower's credit score group
function findCreditBand(score: number) {
    if (score < 620) return "Below 620";
    if (score < 680) return "620–679";
    if (score < 740) return "680–739";
    if (score < 800) return "740–799";

    return "800+";
}

export default function ReportsPage() {
    const [assessment, setAssessment] =
        useState<SavedAssessment | null>(null);

    const [bands, setBands] = useState<CreditBand[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionChecked, setSessionChecked] = useState(false);

    const [historicalError, setHistoricalError] = useState("");

    // Read the latest completed mortgage assessment
    useEffect(() => {
        setAssessment(getAssessment());
        setSessionChecked(true);

        async function loadHistoricalData() {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/analytics/credit-score`
                );

                if (!response.ok) {
                    throw new Error("Historical data unavailable.");
                }

                const data: CreditBand[] = await response.json();

                setBands(data);
            } catch {
                setHistoricalError(
                    "Historical comparison is temporarily unavailable."
                );
            } finally {
                setLoading(false);
            }
        }

        loadHistoricalData();
    }, []);

    // Open the browser print / Save as PDF window
    function exportReport() {
        window.print();
    }

    // Wait until browser session storage is checked
    if (!sessionChecked) {
        return (
            <div className="p-7 text-sm text-[#91A4BA]">
                Loading assessment report...
            </div>
        );
    }

    // Display this when no assessment has been completed
    if (!assessment) {
        return (
            <div className="mx-auto max-w-5xl space-y-7 pb-12">

                <header className="border-b border-[#293B51] pb-6">
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        Workspace / Reports
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold text-[#E8EFF7]">
                        Assessment Reports
                    </h1>
                </header>

                <section className="border border-[#293B51] bg-[#142238] p-10">

                    <FileText
                        size={28}
                        className="text-[#48C6C0]"
                    />

                    <h2 className="mt-5 text-xl font-semibold text-white">
                        No Completed Assessment Found
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#91A4BA]">
                        Complete a mortgage risk assessment first.
                        Your latest financial information and experimental
                        model results will then appear here as a
                        structured financial report.
                    </p>

                    <Link
                        href="/assessment"
                        className="mt-6 inline-flex items-center gap-2 bg-[#48C6C0] px-5 py-3 text-sm font-semibold text-[#081624]"
                    >
                        Start Risk Assessment
                        <ArrowUpRight size={16} />
                    </Link>

                </section>
            </div>
        );
    }

    // ==========================================
    // MORTGAGE DATA
    // ==========================================

    const input = assessment.inputs;
    const prediction = assessment.prediction;

    // Read the original property value from assessment storage
    const savedPropertyValue = Number(
        assessment.property_value
    );

    // Estimate property value if the original was not saved
    const inferredPropertyValue =
        Number.isFinite(input.loan_amount) &&
            Number.isFinite(input.ltv) &&
            input.ltv > 0
            ? (input.loan_amount * 100) / input.ltv
            : null;

    // Prefer the actual property value
    const propertyValue =
        Number.isFinite(savedPropertyValue) &&
            savedPropertyValue > 0
            ? savedPropertyValue
            : inferredPropertyValue;

    // Track whether an estimated figure is being displayed
    const propertyValueEstimated =
        !(
            Number.isFinite(savedPropertyValue) &&
            savedPropertyValue > 0
        ) &&
        propertyValue !== null;

    // ==========================================
    // HISTORICAL CREDIT SCORE COMPARISON
    // ==========================================

    const scoreBand = findCreditBand(input.credit_score);

    const historicalBand = bands.find(
        (item) =>
            item.band.trim().replace(/–/g, "-") ===
            scoreBand.replace(/–/g, "-")
    );

    // ==========================================
    // FINANCIAL INTERPRETATIONS
    // ==========================================

    const dtiExplanation =
        input.dti <= 36
            ? "The borrower's debt payments represent a relatively smaller share of monthly income. This may indicate greater room to manage existing financial obligations."
            : input.dti <= 43
                ? "A considerable portion of monthly income is allocated to debt payments. The borrower's remaining financial flexibility should be considered."
                : "A large share of monthly income is allocated to debt payments. This may reduce financial flexibility when unexpected expenses or income changes occur.";

    const ltvExplanation =
        input.ltv <= 80
            ? "The loan represents 80% or less of the property's value. This indicates a comparatively larger initial equity contribution."
            : input.ltv <= 95
                ? "The loan finances a substantial portion of the property's value. The borrower has a smaller initial equity cushion."
                : "The loan amount is high relative to the property's value. Changes in property value may have a greater effect on the borrower's equity position.";

    // ==========================================
    // REPORT INTERFACE
    // ==========================================

    return (
        <div
            id="mortgage-report"
            className="mx-auto max-w-6xl space-y-7 pb-12 print:max-w-none print:space-y-5"
        >

            {/* REPORT HEADER */}

            <header className="flex flex-wrap items-start justify-between gap-5 border-b border-[#293B51] pb-6">

                <div>
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        Workspace / Reports
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold text-[#E8EFF7]">
                        Mortgage Assessment Report
                    </h1>

                    <p className="mt-2 text-sm text-[#91A4BA]">
                        Financial interpretation of the latest completed assessment
                    </p>
                </div>

                <button
                    type="button"
                    onClick={exportReport}
                    disabled={loading}
                    className="flex items-center gap-2 border border-[#365068] bg-[#142238] px-5 py-3 text-sm font-medium text-[#E8EFF7] hover:border-[#48C6C0] disabled:cursor-not-allowed disabled:opacity-50 print:hidden"
                >
                    <Download size={16} />
                    {loading ? "Preparing Report..." : "Export Report"}
                </button>

            </header>

            {/* REPORT IDENTIFICATION */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#293B51] pb-5 text-xs text-[#91A4BA]">
                <span>
                    REPORT TYPE: INDIVIDUAL MORTGAGE ANALYSIS
                </span>

                <span>
                    MODEL: EXPERIMENTAL V2
                </span>

                <span>
                    CURRENCY: USD
                </span>
            </div>

            {/* ======================================
          01 - EXECUTIVE SUMMARY
          ====================================== */}

            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        01 / Executive Summary
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                        Assessment Overview
                    </h2>
                </div>

                <div className="space-y-6 p-7">

                    <div className="grid gap-4 sm:grid-cols-3">

                        {[
                            {
                                label: "Credit Score",
                                value: String(input.credit_score),
                            },
                            {
                                label: "Loan Amount",
                                value: money(input.loan_amount),
                            },
                            {
                                label: "Experimental Model Score",
                                value: `${prediction.risk_score_percent.toFixed(2)}%`,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="min-w-0 border border-[#293B51] bg-[#101C2D] p-5"
                            >
                                <p className="text-xs text-[#91A4BA]">
                                    {item.label}
                                </p>

                                <p className="mt-3 break-words text-2xl font-semibold text-white">
                                    {item.value}
                                </p>
                            </div>
                        ))}

                    </div>

                    <p className="text-sm leading-7 text-[#C5D2DF]">
                        This report reviews a mortgage of{" "}
                        <strong>{money(input.loan_amount)}</strong>{" "}
                        with a credit score of{" "}
                        <strong>{input.credit_score}</strong>.
                        The borrower's debt-to-income ratio is{" "}
                        <strong>{input.dti.toFixed(2)}%</strong>,
                        while the loan-to-value ratio is{" "}
                        <strong>{input.ltv.toFixed(2)}%</strong>.
                        The experimental machine learning model
                        produced a score of{" "}
                        <strong>
                            {prediction.risk_score_percent.toFixed(2)}%
                        </strong>.
                    </p>

                    <p className="text-sm leading-7 text-[#91A4BA]">
                        This score is an experimental model output.
                        It is not a verified probability of default,
                        a credit approval recommendation, or a substitute
                        for a complete underwriting review.
                    </p>

                </div>
            </section>

            {/* ======================================
          02 - FINANCIAL PROFILE
          ====================================== */}

            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        02 / Financial Profile
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                        Borrower and Mortgage Details
                    </h2>
                </div>

                <div className="grid gap-x-12 gap-y-6 p-7 sm:grid-cols-2">

                    {[
                        [
                            "Credit Score",
                            String(input.credit_score),
                        ],
                        [
                            "Loan Amount",
                            money(input.loan_amount),
                        ],
                        [
                            "Property Value",
                            propertyValue !== null
                                ? `${money(propertyValue)}${propertyValueEstimated
                                    ? " (estimated)"
                                    : ""
                                }`
                                : "Not available",
                        ],
                        [
                            "Interest Rate",
                            `${input.interest_rate.toFixed(2)}%`,
                        ],
                        [
                            "Debt-to-Income Ratio",
                            `${input.dti.toFixed(2)}%`,
                        ],
                        [
                            "Loan-to-Value Ratio",
                            `${input.ltv.toFixed(2)}%`,
                        ],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="border-b border-[#293B51] pb-4"
                        >
                            <p className="text-xs text-[#91A4BA]">
                                {label}
                            </p>

                            <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                {value}
                            </p>
                        </div>
                    ))}

                </div>

                {propertyValueEstimated && (
                    <p className="px-7 pb-5 text-xs leading-6 text-[#91A4BA]">
                        Property value was estimated from the loan amount
                        and stored LTV because the original value was
                        unavailable. Minor rounding differences may occur.
                    </p>
                )}

            </section>

            {/* ======================================
          03 - FINANCIAL INTERPRETATION
          ====================================== */}

            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        03 / Financial Interpretation
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                        Understanding the Financial Ratios
                    </h2>
                </div>

                <div className="grid gap-6 p-7 lg:grid-cols-2">

                    {/* DTI */}

                    <div className="border border-[#293B51] bg-[#101C2D] p-6">

                        <p className="text-sm font-medium text-[#E8EFF7]">
                            Debt-to-Income Ratio (DTI)
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-white">
                            {input.dti.toFixed(2)}%
                        </p>

                        <p className="mt-4 text-sm leading-7 text-[#91A4BA]">
                            DTI shows how much of a borrower's gross
                            monthly income is used to repay debts.
                        </p>

                        <p className="mt-4 text-sm leading-7 text-[#C5D2DF]">
                            {dtiExplanation}
                        </p>

                    </div>

                    {/* LTV */}

                    <div className="border border-[#293B51] bg-[#101C2D] p-6">

                        <p className="text-sm font-medium text-[#E8EFF7]">
                            Loan-to-Value Ratio (LTV)
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-white">
                            {input.ltv.toFixed(2)}%
                        </p>

                        <p className="mt-4 text-sm leading-7 text-[#91A4BA]">
                            LTV compares the loan amount with the
                            estimated value of the property.
                        </p>

                        <p className="mt-4 text-sm leading-7 text-[#C5D2DF]">
                            {ltvExplanation}
                        </p>

                    </div>

                </div>

                <p className="px-7 pb-6 text-xs leading-6 text-[#91A4BA]">
                    These explanations use general financial
                    interpretation ranges. They are not the model's
                    internal decision rules or verified contributions
                    to its prediction.
                </p>

            </section>

            {/* ======================================
          04 - HISTORICAL COMPARISON
          ====================================== */}

            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        04 / Historical Comparison
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                        Credit Score and Historical Outcomes
                    </h2>
                </div>

                <div className="space-y-5 p-7">

                    <p className="text-sm leading-7 text-[#C5D2DF]">
                        The mortgage falls within the{" "}
                        <strong>{scoreBand}</strong>{" "}
                        credit-score category.
                    </p>

                    {loading ? (
                        <p className="text-sm text-[#91A4BA]">
                            Loading historical comparison...
                        </p>
                    ) : historicalBand ? (
                        <div className="grid gap-4 sm:grid-cols-3">

                            {[
                                {
                                    label: "Historical Mortgages",
                                    value: historicalBand.mortgages.toLocaleString(),
                                },
                                {
                                    label: "Serious Cases",
                                    value: String(historicalBand.serious_cases),
                                },
                                {
                                    label: "Observed Delinquency Rate",
                                    value: `${historicalBand.delinquency_rate.toFixed(3)}%`,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="min-w-0 border border-[#293B51] bg-[#101C2D] p-5"
                                >
                                    <p className="text-xs text-[#91A4BA]">
                                        {item.label}
                                    </p>

                                    <p className="mt-3 break-words text-xl font-semibold text-white">
                                        {item.value}
                                    </p>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p className="text-sm text-[#91A4BA]">
                            {historicalError ||
                                "No matching historical comparison was found."}
                        </p>
                    )}

                    <p className="text-xs leading-6 text-[#91A4BA]">
                        This comparison is based only on credit-score
                        categories in the historical labelled dataset.
                        It is not a fully matched group of borrowers
                        and does not provide an individual default
                        probability.
                    </p>

                </div>
            </section>

            {/* ======================================
          05 - MODEL ASSESSMENT
          ====================================== */}

            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                        05 / Model Assessment
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                        Experimental Credit Risk Result
                    </h2>
                </div>

                <div className="space-y-6 p-7">

                    <div className="border border-[#365068] bg-[#101C2D] p-6">

                        <p className="text-sm text-[#91A4BA]">
                            Experimental Model Score
                        </p>

                        <p className="mt-3 text-4xl font-semibold text-white">
                            {prediction.risk_score_percent.toFixed(2)}%
                        </p>

                        <p className="mt-3 text-xs text-[#91A4BA]">
                            Raw model score:{" "}
                            {prediction.experimental_risk_score.toFixed(4)}
                        </p>

                    </div>

                    <p className="text-sm leading-7 text-[#C5D2DF]">
                        Our Logistic Regression V2 model evaluates
                        historical relationships between mortgage
                        characteristics and observed serious delinquency.
                        It generates an experimental numerical score
                        for the mortgage being assessed.
                    </p>

                    <p className="text-sm leading-7 text-[#C5D2DF]">
                        The score should not be interpreted as a
                        confirmed likelihood that this mortgage
                        will become delinquent.
                    </p>

                    <div className="flex gap-4 border-l-2 border-[#D4A46A] bg-[#101C2D] p-5">

                        <ShieldAlert
                            size={20}
                            className="shrink-0 text-[#D4A46A]"
                        />

                        <div>
                            <p className="text-sm font-semibold text-[#E8EFF7]">
                                Important Model Limitations
                            </p>

                            <p className="mt-2 text-xs leading-6 text-[#91A4BA]">
                                The model was developed using historical
                                US mortgage data and a very small number
                                of observed serious delinquency cases.
                                Its scores have not been calibrated as
                                probabilities of default or validated
                                for actual lending decisions.
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* REPORT FOOTER */}

            <footer className="border-t border-[#293B51] pt-5">
                <p className="text-xs leading-6 text-[#91A4BA]">
                    Credit Risk Intelligence — Research Prototype.
                    Historical data source: Freddie Mac 2016
                    mortgage sample. This report is intended
                    for educational and demonstration purposes only.
                </p>
            </footer>

        </div>
    );
}
