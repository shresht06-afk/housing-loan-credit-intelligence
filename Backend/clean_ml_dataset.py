import pandas as pd
from pathlib import Path

# Load provisional ML dataset
df = pd.read_csv("Data/ml_training_dataset_provisional.csv")

print("\nBEFORE CLEANING")
print("Total Mortgages:", len(df))
print("DTI = 999:", (df["DTI"] == 999).sum())
print("LTV above 100:", (df["LTV"] > 100).sum())

# Replace Freddie Mac's unavailable DTI code
df["DTI"] = df["DTI"].replace(999, pd.NA)

# Check for invalid values
invalid = (
    ~df["Credit Score"].between(300, 850)
    | ~df["DTI"].between(1, 65)
    | ~df["LTV"].between(1, 300)
    | ~df["Interest Rate"].between(0.1, 20)
    | (df["Loan Amount"] <= 0)
)

# Separate questionable records for inspection
review = df[invalid].copy()
clean = df[~invalid].copy()

# Remove records with missing inputs for baseline
clean = clean.dropna()

# Save both datasets
Path("Data").mkdir(exist_ok=True)

review.to_csv("Data/ml_records_for_review.csv", index=False)

clean.to_csv("Data/ml_training_dataset_clean.csv", index=False)

print("\nAFTER CLEANING")
print("Clean Mortgages:", len(clean))
print("Records for Review:", len(review))

print("\nTarget Distribution:")
print(clean["Target"].value_counts())

print("\nRemaining Missing Values:")
print(clean.isna().sum())

print("\nClean Financial Summary:")
print(
    clean[["Credit Score", "DTI", "LTV", "Interest Rate", "Loan Amount"]]
    .describe()
    .round(2)
)

print("\nFiles saved successfully!")
