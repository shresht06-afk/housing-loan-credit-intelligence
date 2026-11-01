
import { API_BASE_URL } from "./config";

// Mortgage inputs sent to the FastAPI backend
export type MortgageInput = {
    credit_score: number;
    dti: number;
    ltv: number;
    interest_rate: number;
    loan_amount: number;
};

// Response received from our ML model
export type PredictionResult = {
    experimental_risk_score: number;
    risk_score_percent: number;
    model_version: string;
    disclaimer: string;
};

// Send mortgage information to the backend
export async function predictMortgageRisk(
    input: MortgageInput
): Promise<PredictionResult> {

    const response = await fetch(
        `${API_BASE_URL}/predict`,
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
