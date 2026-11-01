
export type MortgageInput = {
    credit_score: number;
    dti: number;
    ltv: number;
    interest_rate: number;
    loan_amount: number;
};

export type PredictionResult = {
    experimental_risk_score: number;
    risk_score_percent: number;
    model_version: string;
    disclaimer: string;
};

export async function predictMortgageRisk(
    input: MortgageInput
): Promise<PredictionResult> {
    const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(
            `Prediction failed (HTTP ${response.status}): ${message}`
        );
    }

    return response.json();
}
