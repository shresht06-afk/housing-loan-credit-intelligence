
"use client";

import { useState } from "react";
import { saveAssessment } from "@/lib/assessmentStorage";

import {
    predictMortgageRisk,
    type PredictionResult,
} from "../../lib/api";

type MortgageForm = {
    creditScore: string;
    monthlyIncome: string;
    monthlyDebt: string;
    loanAmount: string;
    propertyValue: string;
    interestRate: string;
};

const initialForm: MortgageForm = {
    creditScore: "",
    monthlyIncome: "",
    monthlyDebt: "",
    loanAmount: "",
    propertyValue: "",
    interestRate: "",
};

const fields: {
    key: keyof MortgageForm;
    label: string;
    placeholder: string;
}[] = [
        {
            key: "creditScore",
            label: "Credit Score",
            placeholder: "e.g. 730",
        },
        {
            key: "monthlyIncome",
            label: "Gross Monthly Income ($)",
            placeholder: "e.g. 8000",
        },
        {
            key: "monthlyDebt",
            label: "Total Monthly Debt Payments ($)",
            placeholder: "e.g. 2800",
        },
        {
            key: "loanAmount",
            label: "Loan Amount ($)",
            placeholder: "e.g. 250000",
        },
        {
            key: "propertyValue",
            label: "Property Value ($)",
            placeholder: "e.g. 320000",
        },
        {
            key: "interestRate",
            label: "Interest Rate (%)",
            placeholder: "e.g. 4.25",
        },
    ];

export default function AssessmentPage() {
    const [form, setForm] = useState<MortgageForm>(initialForm);

    const [prediction, setPrediction] =
        useState<PredictionResult | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    // Convert form inputs into numbers
    const income = Number(form.monthlyIncome);
    const debt = Number(form.monthlyDebt);
    const loan = Number(form.loanAmount);
    const property = Number(form.propertyValue);

    // Calculate DTI and LTV automatically
    const dti =
        form.monthlyIncome !== "" && income > 0 &&
            form.monthlyDebt !== ""
            ? (debt / income) * 100
            : null;

    const ltv =
        form.propertyValue !== "" && property > 0 &&
            form.loanAmount !== ""
            ? (loan / property) * 100
            : null;

    function updateField(
        field: keyof MortgageForm,
        value: string
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        // Clear previous results when inputs change
        setPrediction(null);
        setError("");
        setWarning("");
    }

    function resetForm() {
        setForm(initialForm);
        setPrediction(null);
        setError("");
        setWarning("");
    }

    async function handlePrediction() {
        setError("");
        setPrediction(null);
        setWarning("");

        const allFieldsFilled = Object.values(form).every(
            (value) => value.trim() !== ""
        );

        const creditScore = Number(form.creditScore);
        const interestRate = Number(form.interestRate);

        if (!allFieldsFilled) {
            setError("Please complete all mortgage information fields.");
            return;
        }

        if (
            !Number.isInteger(creditScore) ||
            creditScore < 300 ||
            creditScore > 850
        ) {
            setError("Credit score must be between 300 and 850.");
            return;
        }

        if (
            income <= 0 ||
            debt < 0 ||
            loan <= 0 ||
            property <= 0 ||
            interestRate <= 0 ||
            interestRate > 20 ||
            dti === null ||
            ltv === null ||
            !Number.isFinite(dti) ||
            !Number.isFinite(ltv) ||
            dti > 100 ||
            ltv > 300
        ) {
            setError(
                "Please enter valid financial information. DTI must not exceed 100%, LTV must not exceed 300%, and the interest rate must be greater than 0% and no more than 20%."
            );
            return;
        }

        // Check whether inputs are outside observed training ranges
        const outsideTrainingRange =
            creditScore < 456 ||
            creditScore > 832 ||
            ltv < 3 ||
            ltv > 260 ||
            interestRate < 2.25 ||
            interestRate > 6 ||
            loan < 10000 ||
            loan > 968000;

        if (outsideTrainingRange) {
            setWarning(
                "One or more inputs fall outside the observed ranges of the original labelled dataset. The resulting model score may be less reliable."
            );
        }

        setLoading(true);

        try {
            const result = await predictMortgageRisk({
                credit_score: creditScore,
                dti: Number(dti.toFixed(2)),
                ltv: Number(ltv.toFixed(2)),
                interest_rate: interestRate,
                loan_amount: loan,
            });

            setPrediction(result);

            saveAssessment({
                inputs: {
                    credit_score: creditScore,
                    dti: Number(dti.toFixed(2)),
                    ltv: Number(ltv.toFixed(2)),
                    interest_rate: interestRate,
                    loan_amount: loan,
                },
                monthly_income: income,
                monthly_debt: debt,
                property_value: property,
                prediction: result,
                created_at: new Date().toISOString(),
            });

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to connect to the prediction service."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-6xl space-y-7 pb-10">

            {/* Page heading */}
            <header className="border-b border-[#293B51] pb-6">
                <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                    Workspace / Risk Assessment
                </p>

                <h1 className="mt-3 text-2xl font-semibold text-[#E8EFF7]">
                    New Mortgage Assessment
                </h1>

                <p className="mt-2 text-sm text-[#91A4BA]">
                    Enter borrower and loan information to generate
                    an experimental credit risk assessment.
                </p>
            </header>

            {/* Mortgage input form */}
            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <h2 className="text-base font-semibold text-[#E8EFF7]">
                        Mortgage Information
                    </h2>

                    <p className="mt-1 text-xs text-[#91A4BA]">
                        All financial amounts are in US dollars.
                    </p>
                </div>

                <div className="grid gap-6 p-7 md:grid-cols-2">
                    {fields.map((field) => (
                        <div key={field.key}>
                            <label
                                htmlFor={field.key}
                                className="mb-2 block text-xs font-medium text-[#C5D2DF]"
                            >
                                {field.label}
                            </label>

                            <input
                                id={field.key}
                                type="number"
                                min="0"
                                step={field.key === "creditScore" ? "1" : "any"}
                                value={form[field.key]}
                                placeholder={field.placeholder}
                                onChange={(event) =>
                                    updateField(field.key, event.target.value)
                                }
                                className="w-full border border-[#365068] bg-[#101C2D] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#61758C] focus:border-[#48C6C0]"
                            />
                        </div>
                    ))}
                </div>

                <div className="border-t border-[#293B51] px-7 py-4">
                    <p className="text-xs leading-5 text-[#91A4BA]">
                        For the DTI calculation, total monthly debt payments
                        should include the proposed mortgage payment and
                        other recurring debt obligations.
                    </p>
                </div>
            </section>

            {/* Calculated financial ratios */}
            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <h2 className="text-base font-semibold text-[#E8EFF7]">
                        Calculated Financial Ratios
                    </h2>
                </div>

                <div className="grid gap-6 p-7 sm:grid-cols-2">

                    <div>
                        <p className="text-xs text-[#91A4BA]">
                            Debt-to-Income Ratio (DTI)
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-[#E8EFF7]">
                            {dti === null ? "—" : `${dti.toFixed(2)}%`}
                        </p>

                        <p className="mt-2 text-xs text-[#72869D]">
                            Monthly debt payments / Gross monthly income
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-[#91A4BA]">
                            Loan-to-Value Ratio (LTV)
                        </p>

                        <p className="mt-3 text-3xl font-semibold text-[#E8EFF7]">
                            {ltv === null ? "—" : `${ltv.toFixed(2)}%`}
                        </p>

                        <p className="mt-2 text-xs text-[#72869D]">
                            Loan amount / Property value
                        </p>
                    </div>

                </div>
            </section>

            {/* Assessment controls */}
            <section className="border border-[#293B51] bg-[#142238]">

                <div className="border-b border-[#293B51] px-7 py-5">
                    <h2 className="text-base font-semibold text-[#E8EFF7]">
                        Credit Risk Evaluation
                    </h2>

                    <p className="mt-1 text-xs text-[#91A4BA]">
                        Submit the information to the experimental
                        mortgage risk prediction model.
                    </p>
                </div>

                <div className="p-7">

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handlePrediction}
                            disabled={loading}
                            className="bg-[#48C6C0] px-6 py-3 text-sm font-semibold text-[#0B1220] transition-colors hover:bg-[#6ED8D2] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Evaluating Mortgage..."
                                : "Run Risk Assessment"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            className="border border-[#365068] px-6 py-3 text-sm text-[#C5D2DF] transition-colors hover:bg-[#1D3249] disabled:opacity-50"
                        >
                            Clear Form
                        </button>
                    </div>

                    {/* Validation error */}
                    {error && (
                        <div
                            role="alert"
                            className="mt-5 border-l-2 border-red-400 bg-red-950/20 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    {/* Out-of-range warning */}
                    {warning && (
                        <div
                            role="status"
                            className="mt-5 border-l-2 border-[#D4A46A] bg-[#D4A46A]/10 px-4 py-3 text-sm text-[#E2C398]"
                        >
                            {warning}
                        </div>
                    )}

                    {/* Prediction result */}
                    {prediction && (
                        <div
                            aria-live="polite"
                            className="mt-8 border-t border-[#293B51] pt-7"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
                                        Assessment Complete
                                    </p>

                                    <h3 className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                        Experimental Risk Model Output
                                    </h3>
                                </div>

                                <span className="border border-[#365068] px-3 py-2 text-xs text-[#91A4BA]">
                                    Model {prediction.model_version.toUpperCase()}
                                </span>
                            </div>

                            <div className="mt-7 border border-[#365068] bg-[#101C2D] p-6">
                                <p className="text-xs text-[#91A4BA]">
                                    Model Score (0–100 Scale)
                                </p>

                                <p className="mt-3 text-4xl font-semibold text-[#E8EFF7]">
                                    {prediction.risk_score_percent.toFixed(2)}%
                                </p>

                                <p className="mt-3 text-xs leading-5 text-[#91A4BA]">
                                    This score is not a calibrated probability
                                    of mortgage default.
                                </p>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">

                                <div className="border border-[#293B51] p-4">
                                    <p className="text-xs text-[#91A4BA]">
                                        Raw Model Score
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                        {prediction.experimental_risk_score.toFixed(4)}
                                    </p>
                                </div>

                                <div className="border border-[#293B51] p-4">
                                    <p className="text-xs text-[#91A4BA]">
                                        Debt-to-Income
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                        {dti?.toFixed(2)}%
                                    </p>
                                </div>

                                <div className="border border-[#293B51] p-4">
                                    <p className="text-xs text-[#91A4BA]">
                                        Loan-to-Value
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-[#E8EFF7]">
                                        {ltv?.toFixed(2)}%
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6 border-l-2 border-[#D4A46A] pl-4">
                                <p className="text-xs font-semibold text-[#D4A46A]">
                                    Model Limitation
                                </p>

                                <p className="mt-2 text-xs leading-6 text-[#91A4BA]">
                                    {prediction.disclaimer}
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* Research disclaimer */}
            <footer className="border-t border-[#293B51] pt-5">
                <p className="text-xs leading-6 text-[#72869D]">
                    Research prototype based on historical US mortgage
                    data. Results are experimental and are not suitable
                    for real-world lending decisions.
                </p>
            </footer>

        </div>
    );
}
