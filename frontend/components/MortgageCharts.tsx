
"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from "recharts";

type CreditBand = {
    band: string;
    mortgages: number;
    serious_cases: number;
    delinquency_rate: number;
};

type MortgageChartsProps = {
    creditScore: number;
    dti: number;
    ltv: number;
    averageCreditScore: number;
    bands: CreditBand[];
};

const colors = {
    teal: "#48C6C0",
    blue: "#6F9CCB",
    muted: "#91A4BA",
    grid: "#293B51",
    background: "#142238",
};

export default function MortgageCharts({
    creditScore,
    dti,
    ltv,
    averageCreditScore,
    bands,
}: MortgageChartsProps) {
    const creditData = [
        {
            name: "Borrower",
            score: creditScore,
        },
        {
            name: "Portfolio Avg.",
            score: averageCreditScore,
        },
    ];

    const ratioData = [
        {
            name: "DTI",
            value: dti,
        },
        {
            name: "LTV",
            value: ltv,
        },
    ];

    const delinquencyData = bands.map((item) => ({
        name: item.band,
        rate: item.delinquency_rate,
        mortgages: item.mortgages,
        cases: item.serious_cases,
    }));

    const panel =
        "border border-[#293B51] bg-[#142238]";

    return (
        <div className="space-y-6">

            <div className="grid gap-6 lg:grid-cols-2">

                {/* CREDIT SCORE COMPARISON */}
                <section className={panel}>
                    <div className="border-b border-[#293B51] px-6 py-5">
                        <h3 className="text-sm font-semibold text-[#E8EFF7]">
                            Credit Score Comparison
                        </h3>

                        <p className="mt-1 text-xs text-[#91A4BA]">
                            Current borrower against the historical portfolio average
                        </p>
                    </div>

                    <div className="h-72 p-5">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={creditData}
                                margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid
                                    stroke={colors.grid}
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: colors.muted, fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    domain={[0, 850]}
                                    tick={{ fill: colors.muted, fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.grid}`,
                                        color: "#E8EFF7",
                                    }}
                                />

                                <Bar dataKey="score" maxBarSize={65}>
                                    {creditData.map((item, index) => (
                                        <Cell
                                            key={item.name}
                                            fill={index === 0 ? colors.teal : colors.blue}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* FINANCIAL RATIOS */}
                <section className={panel}>
                    <div className="border-b border-[#293B51] px-6 py-5">
                        <h3 className="text-sm font-semibold text-[#E8EFF7]">
                            Borrower Financial Ratios
                        </h3>

                        <p className="mt-1 text-xs text-[#91A4BA]">
                            Debt-to-income and loan-to-value percentages
                        </p>
                    </div>

                    <div className="h-72 p-5">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={ratioData}
                                margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid
                                    stroke={colors.grid}
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: colors.muted, fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    domain={[0, Math.max(100, ltv, dti)]}
                                    tick={{ fill: colors.muted, fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    unit="%"
                                />

                                <Tooltip
                                    formatter={(value) => `${Number(value).toFixed(2)}%`}
                                    contentStyle={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.grid}`,
                                        color: "#E8EFF7",
                                    }}
                                />

                                <Bar
                                    dataKey="value"
                                    fill={colors.teal}
                                    maxBarSize={65}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>

            {/* HISTORICAL DELINQUENCY CHART */}
            <section className={panel}>
                <div className="border-b border-[#293B51] px-6 py-5">
                    <h3 className="text-sm font-semibold text-[#E8EFF7]">
                        Historical Delinquency by Credit Score
                    </h3>

                    <p className="mt-1 text-xs text-[#91A4BA]">
                        Observed serious delinquency frequency by credit-score band
                    </p>
                </div>

                <div className="h-80 p-5">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={delinquencyData}
                            margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid
                                stroke={colors.grid}
                                vertical={false}
                            />

                            <XAxis
                                dataKey="name"
                                tick={{ fill: colors.muted, fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fill: colors.muted, fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                unit="%"
                            />

                            <Tooltip
                                formatter={(value) =>
                                    `${Number(value).toFixed(3)}%`
                                }
                                contentStyle={{
                                    backgroundColor: colors.background,
                                    border: `1px solid ${colors.grid}`,
                                    color: "#E8EFF7",
                                }}
                            />

                            <Bar
                                dataKey="rate"
                                fill={colors.blue}
                                maxBarSize={80}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="border-t border-[#293B51] px-6 py-4">
                    <p className="text-xs leading-5 text-[#91A4BA]">
                        Historical observed frequencies are not calibrated
                        individual probabilities of default.
                    </p>
                </div>
            </section>
        </div>
    );
}
