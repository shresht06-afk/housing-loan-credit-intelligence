import pandas as pd

# Step 1: Load our existing target dataset

targets = pd.read_csv(
    "Data/credit_risk_target.csv", dtype={"Loan ID": str, "Target": str}
)

# Step 2: Load original mortgage IDs

origination_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

origination = pd.read_csv(
    origination_path, sep="|", header=None, usecols=[19], dtype=str
)

origination.columns = ["Loan ID"]

# Step 3: Include all 50,000 original mortgages

all_loans = origination.merge(
    targets[["Loan ID", "Target", "Months_Observed"]], on="Loan ID", how="left"
)

all_loans["Target"] = all_loans["Target"].fillna("No Records")

# Step 4: Load termination information

performance_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"

performance = pd.read_csv(
    performance_path, sep="|", header=None, usecols=[0, 1, 8, 9], dtype=str
)

performance.columns = [
    "Loan ID",
    "Reporting Month",
    "Zero Balance Code",
    "Zero Balance Date",
]

# Step 5: Keep records containing termination codes

termination = performance[performance["Zero Balance Code"].notna()].copy()

# Step 6: Join termination information to mortgages

review = all_loans.merge(
    termination[["Loan ID", "Zero Balance Code", "Zero Balance Date"]],
    on="Loan ID",
    how="left",
)

# Step 7: Review target groups

print("\nCREDIT RISK TERMINATION REVIEW")

print("\n1. INITIAL TARGET COUNTS")
print(all_loans["Target"].value_counts().to_string())

print("\n2. TERMINATION CODES BY TARGET")

print(
    pd.crosstab(review["Target"], review["Zero Balance Code"], dropna=False).to_string()
)

# Step 8: Save the review dataset

review.to_csv("Data/termination_target_review.csv", index=False)

print("\nReview dataset saved successfully!")
print("File: Data/termination_target_review.csv")
