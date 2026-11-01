import pandas as pd

# Step 1: Load our existing datasets

targets = pd.read_csv(
    "Data/credit_risk_target.csv", dtype={"Loan ID": str, "Target": str}
)

repayment = pd.read_csv(
    "Data/first_12_months.csv", dtype={"Loan ID": str, "Delinquency Status": str}
)


# Step 2: Select mortgages with Unknown targets

unknown = targets[targets["Target"] == "Unknown"].copy()

print("\nINCOMPLETE MORTGAGE ANALYSIS")

print("Total Unknown Mortgages:", len(unknown))


# Step 3: Select five example mortgages

sample_loans = unknown.head(5)

print("\nFIVE INCOMPLETE MORTGAGES")

print(
    sample_loans[["Loan ID", "Months_Observed", "First_Month", "Last_Month"]].to_string(
        index=False
    )
)


# Step 4: Display repayment history for each mortgage

for loan_id in sample_loans["Loan ID"]:
    loan_history = repayment[repayment["Loan ID"] == loan_id].sort_values(
        "Month Number"
    )

    print("\n--------------------------------")

    print("Loan ID:", loan_id)

    print(
        loan_history[
            ["Reporting Month", "Month Number", "Delinquency Status"]
        ].to_string(index=False)
    )


print("\nIncomplete mortgage analysis completed!")
