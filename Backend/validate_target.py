import pandas as pd

# Step 1: Load our prepared repayment dataset

df = pd.read_csv(
    "Data/first_12_months.csv", dtype={"Loan ID": str, "Delinquency Status": str}
)

print("\nTARGET VALIDATION REPORT")


# Step 2: Check all delinquency codes

print("\n1. DELINQUENCY STATUS COUNTS")

print(df["Delinquency Status"].value_counts(dropna=False).to_string())


# Step 3: Check duplicate mortgage-month combinations

duplicates = df.duplicated(subset=["Loan ID", "Month Number"]).sum()

print("\n2. DUPLICATE MONTHLY RECORDS")

print("Duplicate Loan ID + Month Number:", duplicates)


# Step 4: Check missing information

print("\n3. MISSING INFORMATION")

print("Missing Loan IDs:", df["Loan ID"].isna().sum())

print("Missing Delinquency Status:", df["Delinquency Status"].isna().sum())

print("Missing Month Numbers:", df["Month Number"].isna().sum())


# Step 5: Examine the mortgage that changed labels

loan_id = "F16Q10000027"

loan_history = df[df["Loan ID"] == loan_id].sort_values("Month Number")

print("\n4. MORTGAGE CASE CHECK")

print(
    loan_history[["Loan ID", "Month Number", "Delinquency Status"]].to_string(
        index=False
    )
)


print("\nValidation inspection completed!")
