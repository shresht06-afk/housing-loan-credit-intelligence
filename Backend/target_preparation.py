import pandas as pd
from pathlib import Path

# Step 1: File locations

origination_path = Path(r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt")

performance_path = Path(r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt")

output_path = Path("Data/first_12_months.csv")


# Step 2: Load mortgage IDs and first payment dates

origination = pd.read_csv(
    origination_path, sep="|", header=None, usecols=[1, 19], dtype=str
)

origination.columns = ["First Payment Date", "Loan ID"]

origination["First Payment Date"] = pd.to_datetime(
    origination["First Payment Date"], format="%Y%m", errors="coerce"
)

origination = origination.dropna(subset=["Loan ID", "First Payment Date"])

origination = origination.drop_duplicates(subset=["Loan ID"])

print("Origination mortgages loaded:", len(origination))


# Step 3: Prepare the output folder

output_path.parent.mkdir(parents=True, exist_ok=True)

# Remove the previous output if the program is run again
if output_path.exists():
    output_path.unlink()


# Step 4: Read performance records in chunks

chunks = pd.read_csv(
    performance_path,
    sep="|",
    header=None,
    usecols=[0, 1, 3],
    dtype=str,
    chunksize=50000,
)

total_selected = 0
first_chunk = True

for chunk in chunks:
    chunk.columns = ["Loan ID", "Reporting Month", "Delinquency Status"]

    # Connect each repayment record to its first payment date
    chunk = chunk.merge(origination, on="Loan ID", how="inner", validate="many_to_one")

    # Convert reporting month into a date
    chunk["Reporting Month"] = pd.to_datetime(
        chunk["Reporting Month"], format="%Y%m", errors="coerce"
    )

    # Calculate the month number relative to first payment
    chunk["Month Number"] = (
        (chunk["Reporting Month"].dt.year - chunk["First Payment Date"].dt.year) * 12
        + (chunk["Reporting Month"].dt.month - chunk["First Payment Date"].dt.month)
        + 1
    )

    # Keep only the first 12 scheduled payment months
    selected = chunk[chunk["Month Number"].between(1, 12)].copy()

    # Save the selected records
    selected.to_csv(
        output_path, mode="w" if first_chunk else "a", header=first_chunk, index=False
    )

    first_chunk = False
    total_selected += len(selected)

    print("Selected repayment records:", total_selected)


# Step 5: Display final result

print("\n12-MONTH DATA PREPARATION COMPLETED")

print("Total selected records:", total_selected)

print("Saved file:", output_path)
