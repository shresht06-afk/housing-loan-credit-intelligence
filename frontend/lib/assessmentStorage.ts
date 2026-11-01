
import type {
    MortgageInput,
    PredictionResult,
} from "./api";

export type SavedAssessment = {
    inputs: MortgageInput;
    monthly_income: number;
    monthly_debt: number;
    property_value: number;
    prediction: PredictionResult;
    created_at: string;
};

const STORAGE_KEY = "credit_intelligence_assessment";

export function saveAssessment(
    assessment: SavedAssessment
) {
    sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(assessment)
    );
}

export function getAssessment(): SavedAssessment | null {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return null;

    try {
        return JSON.parse(saved) as SavedAssessment;
    } catch {
        return null;
    }
}

export function clearAssessment() {
    sessionStorage.removeItem(STORAGE_KEY);
}
