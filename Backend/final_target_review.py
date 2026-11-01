
import pandas as pd

# Step 1: Load existing target labels

targets = pd.read_csv(
    "Data/credit_risk_target.csv",
    dtype={"Loan ID": str, "Target": str}
)

# Step 2: Load termination timing results

timing = pd.read_csv(
    "Data/termination_timing.csv",
    dtype={"Loan ID": str}
)

# Step 3: Keep only required columns

timing = timing[
    ["Loan ID", "Termination Month", "Termination Timing"]
].copy()

# Step 4: Remove repeated identical records

timing = timing.drop_duplicates()

# Step 5: Check mortgages with multiple timing records

counts = timing.groupby("Loan ID").size()

print("\nMORTGAGES WITH MULTIPLE TIMING RECORDS:")
print((counts > 1).sum())

# Step 6: Summarise timing per mortgage
# Keep a separate flag for loans with conflicting records.

timing_summary = timing.groupby("Loan ID").agg(
    Termination_Records=("Termination Timing", "size"),
    Timing_Categories=("Termination Timing", "nunique"),
    First_Termination_Month=("Termination Month", "min")
).reset_index()

# Step 7: Merge with target labels

review = targets.merge(
    timing_summary,
    on="Loan ID",
    how="left",
    validate="one_to_one"
)

# Step 8: Review incomplete mortgages

unknown = review[
    review["Target"] == "Unknown"
].copy()

print("\nFINAL TARGET REVIEW")

print("\n1. UNKNOWN MORTGAGES:")
print(len(unknown))

print("\n2. UNKNOWN MORTGAGES WITH TERMINATION INFORMATION:")
print(unknown["Termination_Records"].notna().sum())

print("\n3. TERMINATION MONTHS FOR UNKNOWN MORTGAGES:")
print(
    unknown["First_Termination_Month"]
    .describe()
)

print("\n4. MORTGAGES WITH CONFLICTING TIMING CATEGORIES:")
print(
    (unknown["Timing_Categories"] > 1).sum()
)

# Step 9: Save review file

review.to_csv(
    "Data/final_target_review.csv",
    index=False
)

print("\nReview file saved successfully!")
print("File: Data/final_target_review.csv")
