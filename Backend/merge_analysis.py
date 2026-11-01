import pandas as pd

# Step 1: Locate both datasets

origination_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

performance_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"


# Step 2: Load origination information

origination = pd.read_csv(
    origination_path,
    sep="|",
    header=None,
    usecols=[0, 9, 11, 12, 19],
    nrows=1000,
    dtype={19: str},
)

origination.columns = ["Credit Score", "DTI", "LTV", "Interest Rate", "Loan ID"]


# Step 3: Load monthly performance information

performance = pd.read_csv(
    performance_path, sep="|", header=None, usecols=[0, 1, 3], nrows=1000, dtype=str
)

performance.columns = ["Loan ID", "Reporting Month", "Delinquency Status"]


# Step 4: Convert delinquency codes into numbers

performance["Delinquency Number"] = pd.to_numeric(
    performance["Delinquency Status"], errors="coerce"
)


# Step 5: Identify whether each mortgage reached 90+ day delinquency

performance["Serious Delinquency"] = performance["Delinquency Number"] >= 3

loan_performance = performance.groupby("Loan ID", as_index=False)[
    "Serious Delinquency"
].max()


# Step 6: Connect both datasets using Loan ID

combined_data = pd.merge(
    origination, loan_performance, on="Loan ID", how="inner", validate="one_to_one"
)


# Step 7: Display the combined dataset

print("\nCOMBINED MORTGAGE DATASET")

print(combined_data.head().to_string(index=False))


# Step 8: Display summary information

print("\nMERGE SUMMARY")

print("Origination Mortgages:", len(origination))

print("Unique Performance Mortgages:", len(loan_performance))

print("Successfully Matched Mortgages:", len(combined_data))

print(
    "Mortgages with Observed Serious Delinquency:",
    combined_data["Serious Delinquency"].sum(),
)

print("\nMerge analysis completed!")
