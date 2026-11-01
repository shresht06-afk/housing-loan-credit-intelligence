import pandas as pd

# Step 1: Load our existing target dataset

targets = pd.read_csv(
    "Data/credit_risk_target.csv", dtype={"Loan ID": str, "Target": str}
)

# Step 2: Load selected columns from performance data

file_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"

performance = pd.read_csv(
    file_path, sep="|", header=None, usecols=[0, 1, 8, 9], dtype=str
)

performance.columns = [
    "Loan ID",
    "Reporting Month",
    "Zero Balance Code",
    "Zero Balance Date",
]

print("\nTERMINATION ANALYSIS REPORT")

# Step 3: Count termination codes

print("\n1. ZERO BALANCE CODE COUNTS")

print(performance["Zero Balance Code"].value_counts(dropna=False).to_string())

# Step 4: Find mortgages with Unknown targets

unknown = targets[targets["Target"] == "Unknown"]

# Step 5: Find termination records for these mortgages

unknown_termination = performance[
    performance["Loan ID"].isin(unknown["Loan ID"])
    & performance["Zero Balance Code"].notna()
]

print("\n2. TERMINATION CODES FOR UNKNOWN MORTGAGES")

print(unknown_termination["Zero Balance Code"].value_counts(dropna=False).to_string())

print("\n3. FIRST TEN TERMINATION RECORDS")

print(unknown_termination.head(10).to_string(index=False))

print("\nTermination analysis completed!")
