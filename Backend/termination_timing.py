import pandas as pd

# Step 1: Load the first payment date

origination_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

origination = pd.read_csv(
    origination_path, sep="|", header=None, usecols=[1, 19], dtype=str
)

origination.columns = ["First Payment Date", "Loan ID"]


# Step 2: Load termination information

performance_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"

performance = pd.read_csv(
    performance_path, sep="|", header=None, usecols=[0, 8, 9], dtype=str
)

performance.columns = ["Loan ID", "Zero Balance Code", "Zero Balance Date"]


# Step 3: Keep records with termination codes

termination = performance[performance["Zero Balance Code"].notna()].copy()


# Step 4: Convert dates to YYYYMM format

origination["First Payment Date"] = pd.to_datetime(
    origination["First Payment Date"], format="%Y%m", errors="coerce"
)

termination["Zero Balance Date"] = pd.to_datetime(
    termination["Zero Balance Date"], format="%Y%m", errors="coerce"
)


# Step 5: Merge the datasets

merged = termination.merge(origination, on="Loan ID", how="left")


# Step 6: Calculate termination month

merged["Termination Month"] = (
    (merged["Zero Balance Date"].dt.year - merged["First Payment Date"].dt.year) * 12
    + (merged["Zero Balance Date"].dt.month - merged["First Payment Date"].dt.month)
    + 1
)


# Step 7: Display the results

print("\nTERMINATION TIMING ANALYSIS")

print("\n1. TERMINATION MONTH SUMMARY")

print(merged["Termination Month"].describe())


# Step 8: Classify termination timing


def classify_timing(month):

    if pd.isna(month):
        return "Unknown Timing"

    elif month < 1:
        return "Before First Payment"

    elif month <= 12:
        return "Within First 12 Months"

    else:
        return "After First 12 Months"


merged["Termination Timing"] = merged["Termination Month"].apply(classify_timing)


print("\n2. TERMINATION TIMING COUNTS")

print(merged["Termination Timing"].value_counts())


# Step 9: Save the results

merged.to_csv("Data/termination_timing.csv", index=False)

print("\nTermination timing dataset saved!")
print("File: Data/termination_timing.csv")
