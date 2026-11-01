import pandas as pd
from pathlib import Path

# Step 1: Locate our prepared CSV file

file_path = Path("Data/first_12_months.csv")

# Step 2: Load the dataset

df = pd.read_csv(file_path, dtype={"Loan ID": str, "Delinquency Status": str})

print("\nDataset loaded successfully!")
print("Monthly records:", len(df))


# Step 3: Convert delinquency status into numbers

df["Delinquency Number"] = pd.to_numeric(df["Delinquency Status"], errors="coerce")

# Freddie Mac uses special non-numeric codes.
# We will not treat them as normal repayment statuses.


# Step 4: Identify serious delinquency

df["Serious Delinquency"] = (df["Delinquency Number"] >= 3) & (
    df["Delinquency Number"] <= 12
)


# Step 5: Group all monthly records by mortgage

loan_summary = (
    df.groupby("Loan ID")
    .agg(
        Months_Observed=("Month Number", "nunique"),
        First_Month=("Month Number", "min"),
        Last_Month=("Month Number", "max"),
        Serious_Delinquency=("Serious Delinquency", "max"),
        Missing_Status=("Delinquency Number", lambda x: x.isna().any()),
    )
    .reset_index()
)


# Step 6: Create our initial target


def assign_target(row):

    # Mortgage reached serious delinquency
    if row["Serious_Delinquency"]:
        return 1

    # Complete repayment history with valid statuses
    if (
        row["Months_Observed"] == 12
        and row["First_Month"] == 1
        and row["Last_Month"] == 12
        and not row["Missing_Status"]
    ):
        return 0

    # Incomplete or uncertain repayment history
    return "Unknown"


loan_summary["Target"] = loan_summary.apply(assign_target, axis=1)


# Step 7: Display the results

print("\nCREDIT RISK TARGET SUMMARY")

print(loan_summary["Target"].value_counts())

print("\nFIRST FIVE MORTGAGES")

print(loan_summary.head().to_string(index=False))


# Step 8: Save our target dataset

output_path = Path("Data/credit_risk_target.csv")

loan_summary.to_csv(output_path, index=False)

print("\nTarget dataset saved successfully!")
print("File location:", output_path)
