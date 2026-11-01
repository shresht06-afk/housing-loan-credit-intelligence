import pandas as pd
from pathlib import Path

# Locate our project and training dataset
project_root = Path(__file__).resolve().parent.parent

data_path = project_root / "Data" / "ml_training_dataset_provisional.csv"

# Load the dataset without changing it
df = pd.read_csv(data_path)

print("\nFINAL CREDIT RISK DATA AUDIT")
print("=" * 45)

print("\n1. DATASET SIZE")
print("Total Mortgages:", len(df))
print("Total Columns:", len(df.columns))

print("\n2. TARGET DISTRIBUTION")
print(df["Target"].value_counts(dropna=False))

print("\n3. MISSING VALUES")
print(df.isna().sum())

print("\n4. DTI VERIFICATION")

dti = pd.to_numeric(df["DTI"], errors="coerce")

missing_dti = (dti == 999).sum()

valid_dti = dti[dti.between(1, 100)]

print("DTI = 999:", missing_dti)
print("Valid DTI Records:", len(valid_dti))
print("Raw Average DTI:", round(dti.mean(), 2))
print("Corrected Average DTI:", round(valid_dti.mean(), 2))
print("Median Valid DTI:", round(valid_dti.median(), 2))

print("\n5. FINANCIAL DATA CHECKS")

ltv = pd.to_numeric(df["LTV"], errors="coerce")
credit_score = pd.to_numeric(df["Credit Score"], errors="coerce")

print("LTV above 100:", (ltv > 100).sum())
print("Missing Credit Scores:", credit_score.isna().sum())

print("\n6. DUPLICATE LOANS")

duplicates = df["Loan ID"].duplicated().sum()

print("Duplicate Loan IDs:", duplicates)

print("\n7. FIRST FIVE RECORDS")

columns = ["Credit Score", "DTI", "LTV", "Interest Rate", "Loan Amount", "Target"]

print(df[columns].head().to_string(index=False))

print("\nAudit completed successfully!")
print("No dataset files were modified.")
