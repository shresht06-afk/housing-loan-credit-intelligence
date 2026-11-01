import pandas as pd

# Step 1: Load original mortgage information

origination_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

origination = pd.read_csv(origination_path, sep="|", header=None, dtype=str)

# Step 2: Select financial variables
# Column positions follow our initial origination layout.

loans = origination[[0, 19, 21, 22, 23, 24]].copy()

loans.columns = [
    "Credit Score",
    "Loan ID",
    "DTI",
    "LTV",
    "Interest Rate",
    "Loan Amount",
]

# Step 3: Load target labels

targets = pd.read_csv(
    "Data/credit_risk_target.csv", dtype={"Loan ID": str, "Target": str}
)

# Step 4: Keep only initial Target 0 and Target 1

targets = targets[targets["Target"].isin(["0", "1"])].copy()

# Step 5: Combine datasets using Loan ID

ml_data = loans.merge(
    targets[["Loan ID", "Target"]], on="Loan ID", how="inner", validate="one_to_one"
)

# Step 6: Convert financial columns to numbers

financial_columns = ["Credit Score", "DTI", "LTV", "Interest Rate", "Loan Amount"]

for column in financial_columns:
    ml_data[column] = pd.to_numeric(ml_data[column], errors="coerce")

ml_data["Target"] = ml_data["Target"].astype(int)

# Step 7: Display basic results

print("\nML DATASET PREPARATION REPORT")

print("\nTotal Mortgages:", len(ml_data))

print("\nTarget Distribution:")
print(ml_data["Target"].value_counts())

print("\nMissing Values:")
print(ml_data.isna().sum())

print("\nFirst Five Records:")
print(ml_data.head().to_string(index=False))

# Step 8: Save dataset

ml_data.to_csv("Data/ml_training_dataset_provisional.csv", index=False)

print("\nProvisional ML dataset saved!")
print("File: Data/ml_training_dataset_provisional.csv")
