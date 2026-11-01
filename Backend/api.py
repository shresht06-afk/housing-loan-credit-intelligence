from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Housing Loan Credit Intelligence API", version="0.1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# Load the trained model
PROJECT_ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = PROJECT_ROOT / "Models" / "credit_risk_v2.joblib"

model = joblib.load(MODEL_PATH)


# Input structure
class MortgageInput(BaseModel):
    credit_score: int = Field(ge=300, le=850)
    dti: float | None = Field(default=None, ge=0, le=100)
    ltv: float = Field(gt=0, le=300)
    interest_rate: float = Field(gt=0, le=20)
    loan_amount: float = Field(gt=0)


@app.get("/")
def home():
    return {"message": "Housing Loan Credit Intelligence API", "status": "running"}


@app.post("/predict")
def predict_risk(data: MortgageInput):

    # Create input for our ML model
    features = pd.DataFrame(
        [
            {
                "Credit Score": data.credit_score,
                "DTI": data.dti,
                "LTV": data.ltv,
                "Interest Rate": data.interest_rate,
                "Loan Amount": data.loan_amount,
                "DTI Missing": int(data.dti is None),
            }
        ]
    )

    try:
        score = float(model.predict_proba(features)[0][1])
    except Exception as error:
        raise HTTPException(status_code=500, detail="Prediction failed") from error

    return {
        "experimental_risk_score": round(score, 4),
        "risk_score_percent": round(score * 100, 2),
        "model_version": "v2",
        "disclaimer": (
            "Experimental model score only. "
            "Not a calibrated probability of default "
            "or a lending decision."
        ),
    }


from fastapi import Query

DATA_PATH = PROJECT_ROOT / "Data" / "ml_training_dataset_provisional.csv"


@app.get("/analytics/summary")
def analytics_summary():
    if not DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Mortgage dataset not found")

    df = pd.read_csv(DATA_PATH)

    required = ["Credit Score", "DTI", "LTV", "Target"]

    missing = [col for col in required if col not in df.columns]

    if missing:
        raise HTTPException(status_code=500, detail=f"Missing columns: {missing}")

    df["Target"] = pd.to_numeric(df["Target"], errors="coerce")
    df = df[df["Target"].isin([0, 1])].copy()

    total = len(df)
    positive = int(df["Target"].sum())

    return {
        "total_mortgages": total,
        "serious_delinquency_cases": positive,
        "delinquency_rate_percent": round(positive / total * 100, 3) if total else 0,
        "average_credit_score": round(df["Credit Score"].mean(), 1),
        "average_dti": round(
            pd.to_numeric(df["DTI"], errors="coerce")
            .loc[lambda values: values.between(1, 100)]
            .mean(),
            1,
        ),
        "average_ltv": round(df["LTV"].mean(), 1),
    }


@app.get("/analytics/credit-score")
def credit_score_analysis():
    df = pd.read_csv(DATA_PATH)

    df["Target"] = pd.to_numeric(df["Target"], errors="coerce")
    df = df[df["Target"].isin([0, 1])].copy()

    bins = [0, 620, 680, 740, 800, 900]
    labels = [
        "Below 620",
        "620–679",
        "680–739",
        "740–799",
        "800+",
    ]

    df["Credit Band"] = pd.cut(
        df["Credit Score"], bins=bins, labels=labels, right=False
    )

    grouped = (
        df.groupby("Credit Band", observed=True)
        .agg(mortgages=("Target", "count"), serious_cases=("Target", "sum"))
        .reset_index()
    )

    grouped["delinquency_rate"] = (
        grouped["serious_cases"] / grouped["mortgages"] * 100
    ).round(3)

    return [
        {
            "band": str(row["Credit Band"]),
            "mortgages": int(row["mortgages"]),
            "serious_cases": int(row["serious_cases"]),
            "delinquency_rate": float(row["delinquency_rate"]),
        }
        for _, row in grouped.iterrows()
    ]
