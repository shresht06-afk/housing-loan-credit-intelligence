
"use client";

import { useEffect, useState } from "react";

import MortgageCharts from "../../components/MortgageCharts";
import { API_BASE_URL } from "../../lib/config";

import {
    getAssessment,
    type SavedAssessment,
} from "../../lib/assessmentStorage";

// Historical portfolio summary returned by FastAPI
type Summary = {
    total_mortgages: number;
    serious_delinquency_cases: number;
    delinquency_rate_percent: number;
    average_credit_score: number;
    average_dti: number;
    average_ltv: number;
};

// Credit score analysis returned by FastAPI
type CreditBand = {
    band: string;
    mortgages: number;
    serious_cases: number;
    delinquency_rate: number;
};

export default function AnalyticsPage() {
    // Historical portfolio data
    const [summary, setSummary] = useState<Summary | null>(null);
    const [bands, setBands] = useState<CreditBand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Latest completed individual mortgage assessment
    const [assessment, setAssessment] =
        useState<SavedAssessment | null>(null);

    // Read the assessment saved by Risk Assessment
    useEffect(() => {
        setAssessment(getAssessment());
    }, []);

    // Retrieve historical portfolio analytics from FastAPI
    useEffect(() => {
        async function loadAnalytics() {
            try {
                const [summaryResponse, bandsResponse] =
                    await Promise.all([
                        fetch(`${API_BASE_URL}/analytics/summary`),
                        fetch(`${API_BASE_URL}/analytics/credit-score`),
                    ]);

                if (!summaryResponse.ok || !bandsResponse.ok) {
                    throw new Error(
                        "Unable to retrieve historical analytics data."
                    );
                }

                const summaryData: Summary =
                    await summaryResponse.json();

                const bandsData: CreditBand[] =
                    await bandsResponse.json();

                setSummary(summaryData);
                setBands(bandsData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Analytics service unavailable."
                );
            } finally {
                setLoading(false);
            }
        }

        loadAnalytics();
    }, []);

    return (
        <div className="mx-auto max-w-6xl space-y-7 pb-10">

            {/* PAGE HEADING */}
            <header className="border-b border-[#293B51] pb-6">
                <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                    Workspace / Analytics
                </p>

                <h1 className="mt-3 text-2xl font-semibold text-[#E8EFF7]">
                    Mortgage Analytics
                </h1>

                <p className="mt-2 text-sm text-[#91A4BA]">
                    Review individual mortgage assessments alongside
                    historical portfolio statistics.
                </p>
            </header>

            {/* INDIVIDUAL MORTGAGE ANALYSIS */}
            {assessment ? (
                <section className="border border-[#293B51] bg-[#142238]">

                    <div className="border-b border-[#293B51] px-7 py-5">
                        <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                            Individual Mortgage Analysis
                        </p>

                        <h2 className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                            Current Mortgage Assessment
                        </h2>

                        <p className="mt-1 text-xs text-[#91A4BA]">
                            Financial information from the latest
                            completed risk assessment.
                        </p>
                    </div>

                    <div className="p-7">

                        {/* Individual financial metrics */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    label: "Credit Score",
                                    value: assessment.inputs.credit_score.toString(),
                                },
                                {
                                    label: "Debt-to-Income Ratio",
                                    value: `${assessment.inputs.dti.toFixed(2)}%`,
                                },
                                {
                                    label: "Loan-to-Value Ratio",
                                    value: `${assessment.inputs.ltv.toFixed(2)}%`,
                                },
                                {
                                    label: "Experimental Model Score",
                                    value:
                                        `${assessment.prediction.risk_score_percent.toFixed(2)}%`,
                                },
                            ].map((metric) => (
                                <div
                                    key={metric.label}
                                    className="border border-[#293B51] bg-[#101C2D] p-5"
                                >
                                    <p className="text-xs text-[#91A4BA]">
                                        {metric.label}
                                    </p>

                                    <p className="mt-3 text-2xl font-semibold text-[#E8EFF7]">
                                        {metric.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Additional mortgage information */}
                        <div className="mt-6 grid gap-6 border-t border-[#293B51] pt-6 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-[#91A4BA]">
                                    Loan Amount
                                </p>

                                <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                    ${assessment.inputs.loan_amount.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#91A4BA]">
                                    Property Value
                                </p>

                                <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                    ${assessment.property_value.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-[#91A4BA]">
                                    Interest Rate
                                </p>

                                <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                    {assessment.inputs.interest_rate.toFixed(2)}%
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 border-l-2 border-[#D4A46A] pl-4">
                            <p className="text-xs leading-6 text-[#91A4BA]">
                                This is an experimental machine learning
                                score, not a calibrated probability of
                                mortgage default or a lending decision.
                            </p>
                        </div>

                    </div>
                </section>
            ) : (
                <section className="border border-[#293B51] bg-[#142238] p-7">
                    <h2 className="text-base font-semibold text-[#E8EFF7]">
                        Individual Mortgage Analysis
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#91A4BA]">
                        No completed mortgage assessment is available
                        in this browser session. Visit Risk Assessment,
                        enter mortgage information, and run an evaluation
                        to view its results here.
                    </p>
                </section>
            )}

            {/* MORTGAGE ANALYTICS CHARTS */}
            {assessment && summary && bands.length > 0 && (
                <MortgageCharts
                    creditScore={assessment.inputs.credit_score}
                    dti={assessment.inputs.dti}
                    ltv={assessment.inputs.ltv}
                    averageCreditScore={summary.average_credit_score}
                    bands={bands}
                />
            )}

            {/* HISTORICAL PORTFOLIO ANALYTICS HEADING */}
            <div className="border-b border-[#293B51] pb-4">
                <h2 className="text-lg font-semibold text-[#E8EFF7]">
                    Historical Portfolio Analysis
                </h2>

                <p className="mt-2 text-xs text-[#91A4BA]">
                    Statistics from the historical labelled
                    Freddie Mac mortgage dataset.
                </p>
            </div>

            {/* LOADING STATUS */}
            {loading && (
                <p role="status" className="text-sm text-[#91A4BA]">
                    Loading historical mortgage analytics...
                </p>
            )}

            {/* ERROR STATUS */}
            {error && (
                <p role="alert" className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {/* HISTORICAL PORTFOLIO SUMMARY */}
            {summary && (
                <>
                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                label: "Labelled Mortgages",
                                value:
                                    summary.total_mortgages.toLocaleString(),
                            },
                            {
                                label: "Serious Delinquency Cases",
                                value:
                                    summary.serious_delinquency_cases.toLocaleString(),
                            },
                            {
                                label: "Observed Delinquency Rate",
                                value:
                                    `${summary.delinquency_rate_percent.toFixed(3)}%`,
                            },
                        ].map((metric) => (
                            <div
                                key={metric.label}
                                className="border border-[#293B51] bg-[#142238] p-6"
                            >
                                <p className="text-xs text-[#91A4BA]">
                                    {metric.label}
                                </p>

                                <p className="mt-3 text-2xl font-semibold text-[#E8EFF7]">
                                    {metric.value}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* HISTORICAL FINANCIAL PROFILE */}
                    <section className="border border-[#293B51] bg-[#142238]">

                        <div className="border-b border-[#293B51] px-7 py-5">
                            <h2 className="text-base font-semibold text-[#E8EFF7]">
                                Portfolio Financial Profile
                            </h2>
                        </div>

                        <div className="grid gap-6 p-7 md:grid-cols-3">
                            {[
                                {
                                    label: "Average Credit Score",
                                    value:
                                        summary.average_credit_score.toFixed(1),
                                },
                                {
                                    label: "Average DTI",
                                    value:
                                        `${summary.average_dti.toFixed(1)}%`,
                                },
                                {
                                    label: "Average LTV",
                                    value:
                                        `${summary.average_ltv.toFixed(1)}%`,
                                },
                            ].map((metric) => (
                                <div key={metric.label}>
                                    <p className="text-xs text-[#91A4BA]">
                                        {metric.label}
                                    </p>

                                    <p className="mt-2 text-xl font-semibold text-[#E8EFF7]">
                                        {metric.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </section>
                </>
            )}

            {/* CREDIT SCORE DELINQUENCY ANALYSIS */}
            {bands.length > 0 && (
                <section className="border border-[#293B51] bg-[#142238]">

                    <div className="border-b border-[#293B51] px-7 py-5">
                        <h2 className="text-base font-semibold text-[#E8EFF7]">
                            Delinquency by Credit Score
                        </h2>

                        <p className="mt-1 text-xs text-[#91A4BA]">
                            Historical outcome frequency by
                            credit-score band.
                        </p>
                    </div>

                    <div className="overflow-x-auto p-7">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[#365068] text-xs text-[#91A4BA]">
                                    <th className="pb-4 font-medium">
                                        Credit Band
                                    </th>

                                    <th className="pb-4 text-right font-medium">
                                        Mortgages
                                    </th>

                                    <th className="pb-4 text-right font-medium">
                                        Serious Cases
                                    </th>

                                    <th className="pb-4 text-right font-medium">
                                        Rate
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {bands.map((row) => (
                                    <tr
                                        key={row.band}
                                        className="border-b border-[#293B51]"
                                    >
                                        <td className="py-4 text-[#E8EFF7]">
                                            {row.band}
                                        </td>

                                        <td className="py-4 text-right text-[#C5D2DF]">
                                            {row.mortgages.toLocaleString()}
                                        </td>

                                        <td className="py-4 text-right text-[#C5D2DF]">
                                            {row.serious_cases}
                                        </td>

                                        <td className="py-4 text-right font-medium text-[#48C6C0]">
                                            {row.delinquency_rate.toFixed(3)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </section>
            )}

        </div>
    );
}
