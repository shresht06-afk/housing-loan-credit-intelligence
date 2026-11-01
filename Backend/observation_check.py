import pandas as pd

# Load our original mortgage IDs
origination_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

origination = pd.read_csv(
    origination_path, sep="|", header=None, usecols=[19], dtype=str
)

origination.columns = ["Loan ID"]

# Load our initial target dataset
targets = pd.read_csv(
    "Data/credit_risk_target.csv", dtype={"Loan ID": str, "Target": str}
)

# Check mortgages missing from the target dataset
missing = origination[~origination["Loan ID"].isin(targets["Loan ID"])]

print("\nOBSERVATION COMPLETENESS REPORT")

print("\n1. MORTGAGE COVERAGE")
print("Origination Mortgages:", len(origination))
print("Mortgages With Target Records:", len(targets))
print("Mortgages Without Target Records:", len(missing))

# Examine Unknown mortgages
unknown = targets[targets["Target"] == "Unknown"]

print("\n2. UNKNOWN TARGETS")
print("Total Unknown:", len(unknown))

print("\nMonths Observed Among Unknown Mortgages:")
print(unknown["Months_Observed"].value_counts().sort_index().to_string())

# Check the special RA status
repayment = pd.read_csv(
    "Data/first_12_months.csv", dtype={"Loan ID": str, "Delinquency Status": str}
)

ra_records = repayment[repayment["Delinquency Status"] == "RA"]

print("\n3. SPECIAL STATUS CHECK")
print("RA Records:", len(ra_records))

print(
    ra_records[
        ["Loan ID", "Reporting Month", "Month Number", "Delinquency Status"]
    ].to_string(index=False)
)

print("\nObservation check completed!")
