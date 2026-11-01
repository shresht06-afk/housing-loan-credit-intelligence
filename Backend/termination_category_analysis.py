import pandas as pd

# Step 1: Load our previous review dataset

df = pd.read_csv("Data/final_target_review.csv", dtype={"Loan ID": str, "Target": str})

# Step 2: Select Unknown mortgages

unknown = df[df["Target"] == "Unknown"].copy()

# Step 3: Categorise termination timing


def classify_termination(month):

    if pd.isna(month):
        return "No Verified Timing"

    elif month < 1:
        return "Before First Payment"

    elif month <= 12:
        return "Early Termination"

    else:
        return "Late Termination"


unknown["Termination Category"] = unknown["First_Termination_Month"].apply(
    classify_termination
)

# Step 4: Count each category

print("\nTERMINATION CATEGORY ANALYSIS")

print("\n1. TERMINATION CATEGORY COUNTS")

print(unknown["Termination Category"].value_counts().to_string())

# Step 5: Compare with months observed

print("\n2. OBSERVED MONTHS BY TERMINATION CATEGORY")

print(
    unknown.groupby("Termination Category")["Months_Observed"]
    .describe()
    .round(2)
    .to_string()
)

# Step 6: Show example mortgages

print("\n3. FIRST TEN UNKNOWN MORTGAGES")

print(
    unknown[
        [
            "Loan ID",
            "Months_Observed",
            "First_Termination_Month",
            "Termination Category",
        ]
    ]
    .head(10)
    .to_string(index=False)
)

# Step 7: Save the results

unknown.to_csv("Data/termination_category_analysis.csv", index=False)

print("\nTermination category analysis completed!")
print("File: Data/termination_category_analysis.csv")
