
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../lib/config";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Summary = {
  total_mortgages: number;
  serious_delinquency_cases: number;
  delinquency_rate_percent: number;
  average_credit_score: number;
  average_dti: number;
  average_ltv: number;
};

type CreditBand = {
  band: string;
  mortgages: number;
  serious_cases: number;
  delinquency_rate: number;
};

const modelMetrics = [
  {
    label: "ROC-AUC",
    value: "0.7169",
    description: "Ability to rank higher-risk loans above lower-risk loans.",
  },
  {
    label: "PR-AUC",
    value: "0.0113",
    description: "Precision-recall performance for rare delinquency cases.",
  },
  {
    label: "Positive Cases",
    value: "75",
    description: "Serious delinquency cases in the labelled dataset.",
  },
];

export default function OverviewPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [bands, setBands] = useState<CreditBand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {

        const [summaryResponse, bandsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/analytics/summary`),
            fetch(`${API_BASE_URL}/analytics/credit-score`),
          ]);


        if (!summaryResponse.ok || !bandsResponse.ok) {
          throw new Error("Unable to load portfolio information.");
        }

        setSummary(await summaryResponse.json());
        setBands(await bandsResponse.json());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to the analytics service."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  const chartData = bands.map((item) => ({
    name: item.band,
    rate: item.delinquency_rate,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">

      {/* PAGE HEADING */}
      <header className="border-b border-[#293B51] pb-6">
        <p className="text-xs uppercase tracking-wider text-[#48C6C0]">
          Workspace / Overview
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#E8EFF7]">
              Portfolio Intelligence
            </h1>

            <p className="mt-2 text-sm text-[#91A4BA]">
              Historical mortgage portfolio monitoring and
              experimental model performance.
            </p>
          </div>

          <span className="border border-[#365068] px-3 py-2 text-xs text-[#91A4BA]">
            Research Prototype
          </span>
        </div>
      </header>

      {/* DATA STATUS */}
      {loading && (
        <p role="status" className="text-sm text-[#91A4BA]">
          Loading portfolio intelligence...
        </p>
      )}

      {error && (
        <div role="alert" className="border border-red-900 bg-[#251820] p-5">
          <p className="text-sm text-red-300">{error}</p>
          <p className="mt-2 text-xs text-[#91A4BA]">
            Make sure the FastAPI backend is running on port 8000.
          </p>
        </div>
      )}

      {/* PORTFOLIO SNAPSHOT */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#E8EFF7]">
            Portfolio Snapshot
          </h2>
          <p className="mt-1 text-xs text-[#91A4BA]">
            Historical labelled Freddie Mac mortgage data
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Labelled Mortgages",
              value: summary
                ? summary.total_mortgages.toLocaleString()
                : "—",
            },
            {
              label: "Serious Delinquency Cases",
              value: summary
                ? summary.serious_delinquency_cases.toLocaleString()
                : "—",
            },
            {
              label: "Observed Delinquency Rate",
              value: summary
                ? `${summary.delinquency_rate_percent.toFixed(3)}%`
                : "—",
            },
            {
              label: "Average Credit Score",
              value: summary
                ? summary.average_credit_score.toFixed(1)
                : "—",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="border border-[#293B51] bg-[#142238] p-6"
            >
              <p className="text-xs text-[#91A4BA]">
                {metric.label}
              </p>

              <p className="mt-4 text-2xl font-semibold text-[#E8EFF7]">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RISK DISTRIBUTION CHART */}
      <section className="border border-[#293B51] bg-[#142238]">
        <div className="border-b border-[#293B51] px-7 py-5">
          <h2 className="text-base font-semibold text-[#E8EFF7]">
            Credit Risk Distribution
          </h2>

          <p className="mt-1 text-xs text-[#91A4BA]">
            Historical serious delinquency frequency by credit-score band
          </p>
        </div>

        {bands.length > 0 ? (
          <div className="h-80 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  stroke="#293B51"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fill: "#91A4BA", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#91A4BA", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />


                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(3)}%`,
                    "Delinquency Rate",
                  ]}
                  contentStyle={{
                    backgroundColor: "#101C2D",
                    border: "1px solid #365068",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                  }}
                  labelStyle={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "#FFFFFF",
                  }}
                  cursor={{
                    fill: "rgba(72, 198, 192, 0.08)",
                  }}
                />


                <Bar dataKey="rate" maxBarSize={85}>
                  {chartData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={index === 0 ? "#48C6C0" : "#6F9CCB"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="p-7 text-sm text-[#91A4BA]">
            Historical credit-score distribution is unavailable.
          </p>
        )}

        <div className="border-t border-[#293B51] px-7 py-4">
          <p className="text-xs leading-5 text-[#91A4BA]">
            These rates represent observed historical outcomes
            within each credit-score group, not individual
            probabilities of default.
          </p>
        </div>
      </section>

      {/* MODEL PERFORMANCE */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#E8EFF7]">
            Model Performance
          </h2>

          <p className="mt-1 text-xs text-[#91A4BA]">
            Experimental Logistic Regression — Version 2
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {modelMetrics.map((metric) => (
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

              <p className="mt-3 text-xs leading-5 text-[#91A4BA]">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-l-2 border-[#D4A46A] bg-[#142238] px-5 py-4">
          <p className="text-sm font-medium text-[#E8EFF7]">
            Model Evaluation Note
          </p>

          <p className="mt-2 text-xs leading-6 text-[#91A4BA]">
            The model was trained on historical US mortgage
            data with very few serious delinquency cases.
            Its scores are not calibrated default probabilities.
            The current results are suitable for research
            and demonstration, not lending decisions.
          </p>
        </div>
      </section>

      {/* WORKSPACE NAVIGATION */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#E8EFF7]">
            Explore the Platform
          </h2>

          <p className="mt-1 text-xs text-[#91A4BA]">
            Continue to a specialised workspace
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Risk Assessment",
              description:
                "Evaluate a mortgage using the experimental credit risk model.",
              href: "/assessment",
            },
            {
              title: "Mortgage Analytics",
              description:
                "Explore borrower-specific metrics and historical comparisons.",
              href: "/analytics",
            },
            {
              title: "Assessment Reports",
              description:
                "Review a structured explanation of mortgage risk results.",
              href: "/reports",
            },
          ].map((workspace) => (
            <Link
              key={workspace.href}
              href={workspace.href}
              className="group border border-[#293B51] bg-[#142238] p-6 transition-colors hover:border-[#48C6C0]"
            >
              <h3 className="text-sm font-semibold text-[#E8EFF7]">
                {workspace.title}
              </h3>

              <p className="mt-3 min-h-12 text-xs leading-5 text-[#91A4BA]">
                {workspace.description}
              </p>

              <p className="mt-5 text-xs font-medium text-[#48C6C0]">
                Open Workspace →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* DATA SOURCE */}
      <footer className="border-t border-[#293B51] pt-5">
        <p className="text-xs leading-6 text-[#91A4BA]">
          Data source: Freddie Mac historical single-family
          mortgage sample, 2016 origination cohort.
          Portfolio outcomes and model results are
          experimental and subject to data and
          methodology limitations.
        </p>
      </footer>

    </div>
  );
}
