import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

import pandas as pd

# Project configuration
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "Data" / "ml_training_dataset_provisional.csv"
API_URL = "http://127.0.0.1:8000"

passed = 0
failed = 0


def check(name, condition, detail=""):
    global passed, failed

    if condition:
        print(f"[PASS] {name}")
        passed += 1
    else:
        print(f"[FAIL] {name}")
        if detail:
            print("       ", detail)
        failed += 1


def request_api(endpoint, data=None):
    payload = None
    headers = {}

    if data is not None:
        payload = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = Request(
        API_URL + endpoint,
        data=payload,
        headers=headers,
        method="POST" if data is not None else "GET",
    )

    with urlopen(request, timeout=10) as response:
        return response.status, json.load(response)


print("\nCREDIT RISK INTELLIGENCE - FINAL SYSTEM TEST")
print("=" * 55)

# TEST 1: Backend availability
try:
    status, home = request_api("/")
    check("FastAPI backend", status == 200)
except Exception as error:
    print("Backend connection failed:", error)
    print("Start FastAPI before running this script.")
    raise SystemExit(1)


# TEST 2: Historical data integrity
expected_average_dti = None

if DATA_PATH.exists():
    df = pd.read_csv(DATA_PATH)

    required = [
        "Loan ID",
        "Credit Score",
        "DTI",
        "LTV",
        "Interest Rate",
        "Loan Amount",
        "Target",
    ]

    check(
        "Required dataset columns",
        all(column in df.columns for column in required),
    )

    if all(column in df.columns for column in required):
        check(
            "Unique mortgage identifiers",
            not df["Loan ID"].duplicated().any(),
        )

        target = pd.to_numeric(df["Target"], errors="coerce")
        check(
            "Binary target labels",
            target.isin([0, 1]).all(),
        )

        dti = pd.to_numeric(df["DTI"], errors="coerce")
        valid_dti = dti[dti.between(1, 100)]
        expected_average_dti = round(valid_dti.mean(), 1)

        print("\nDATA QUALITY SUMMARY")
        print("Mortgage records:", len(df))
        print("Serious delinquency cases:", int((target == 1).sum()))
        print("DTI = 999:", int((dti == 999).sum()))
        print("Corrected Average DTI:", expected_average_dti)

else:
    check(
        "Training dataset available",
        False,
        f"Missing file: {DATA_PATH}",
    )


# TEST 3: Analytics summary API
try:
    status, summary = request_api("/analytics/summary")

    check("Analytics summary endpoint", status == 200)

    check(
        "Summary contains mortgage count",
        summary.get("total_mortgages", 0) > 0,
    )

    if expected_average_dti is not None:
        check(
            "Corrected average DTI matches API",
            abs(summary["average_dti"] - expected_average_dti) < 0.11,
            "Check whether the API includes DTI = 999.",
        )

except Exception as error:
    check("Analytics summary endpoint", False, str(error))


# TEST 4: Credit score analysis
try:
    status, bands = request_api("/analytics/credit-score")

    check(
        "Credit score analytics endpoint",
        status == 200 and len(bands) > 0,
    )

    total_band_mortgages = sum(item["mortgages"] for item in bands)

    print("\nMortgages in credit score bands:", total_band_mortgages)

    if DATA_PATH.exists():
        check(
            "Credit band counts match dataset",
            total_band_mortgages == len(df),
        )

except Exception as error:
    check("Credit score analytics endpoint", False, str(error))


# TEST 5: Machine learning prediction
sample_mortgage = {
    "credit_score": 730,
    "dti": 35,
    "ltv": 78.13,
    "interest_rate": 4.25,
    "loan_amount": 250000,
}

try:
    status, result = request_api("/predict", sample_mortgage)

    score = result["experimental_risk_score"]
    percent = result["risk_score_percent"]

    check("ML prediction endpoint", status == 200)

    check(
        "Model score is between 0 and 1",
        0 <= score <= 1,
    )

    check(
        "Score and displayed percentage agree",
        abs(percent - score * 100) < 0.02,
    )

    print("\nMODEL PREDICTION")
    print("Experimental Score:", score)
    print("Displayed Percentage:", percent)
    print("Model Version:", result["model_version"])

except Exception as error:
    check("ML prediction endpoint", False, str(error))


# TEST 6: Invalid mortgage rejection
invalid_mortgage = sample_mortgage.copy()
invalid_mortgage["interest_rate"] = 0

try:
    request_api("/predict", invalid_mortgage)
    check("Invalid interest rate rejected", False)

except HTTPError as error:
    check(
        "Invalid interest rate rejected",
        error.code == 422,
    )

except Exception as error:
    check("Invalid interest rate rejected", False, str(error))


# FINAL REPORT
print("\n" + "=" * 55)
print("FINAL TEST SUMMARY")
print("Tests Passed:", passed)
print("Tests Failed:", failed)

if failed == 0:
    print("Backend checks passed successfully!")
else:
    print("Some checks require attention.")

print("=" * 55)
