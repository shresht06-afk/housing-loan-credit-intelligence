import pandas as pd
from pathlib import Path

# Step 1: Locate the complete performance dataset

file_path = Path(r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt")

# Step 2: Create an empty dictionary

loan_summary = {}

total_records = 0

# Step 3: Read the dataset in smaller chunks

chunks = pd.read_csv(
    file_path, sep="|", header=None, usecols=[0, 1, 3], dtype=str, chunksize=50000
)

# Step 4: Process each chunk

for chunk in chunks:
    chunk.columns = ["Loan ID", "Reporting Month", "Delinquency Status"]

    chunk["Delinquency Number"] = pd.to_numeric(
        chunk["Delinquency Status"], errors="coerce"
    )

    chunk["Serious Delinquency"] = chunk["Delinquency Number"] >= 3

    # Group monthly records by mortgage
    grouped = chunk.groupby("Loan ID").agg(
        Months_Observed=("Reporting Month", "count"),
        First_Month=("Reporting Month", "min"),
        Last_Month=("Reporting Month", "max"),
        Serious_Delinquency=("Serious Delinquency", "max"),
    )

    # Combine results across chunks
    for loan_id, row in grouped.iterrows():
        if loan_id not in loan_summary:
            loan_summary[loan_id] = {
                "Loan ID": loan_id,
                "Months Observed": row["Months_Observed"],
                "First Month": row["First_Month"],
                "Last Month": row["Last_Month"],
                "Serious Delinquency": row["Serious_Delinquency"],
            }

        else:
            loan_summary[loan_id]["Months Observed"] += row["Months_Observed"]

            loan_summary[loan_id]["First Month"] = min(
                loan_summary[loan_id]["First Month"], row["First_Month"]
            )

            loan_summary[loan_id]["Last Month"] = max(
                loan_summary[loan_id]["Last Month"], row["Last_Month"]
            )

            loan_summary[loan_id]["Serious Delinquency"] = (
                loan_summary[loan_id]["Serious Delinquency"]
                or row["Serious_Delinquency"]
            )

    total_records += len(chunk)

    print("Processed monthly records:", total_records)


# Step 5: Convert the dictionary into a DataFrame

summary_df = pd.DataFrame(loan_summary.values())


# Step 6: Display the summary

print("\nCOMPLETE PERFORMANCE SUMMARY")

print("Total Monthly Records:", total_records)

print("Unique Mortgages:", len(summary_df))

print(
    "Mortgages with Observed Serious Delinquency:",
    summary_df["Serious Delinquency"].sum(),
)

print("\nFIRST FIVE MORTGAGES")

print(summary_df.head().to_string(index=False))


# Step 7: Save the summary

output_path = Path("Data/full_performance_summary.csv")

output_path.parent.mkdir(parents=True, exist_ok=True)

summary_df.to_csv(output_path, index=False)

print("\nSummary saved successfully!")
print("File location:", output_path)
