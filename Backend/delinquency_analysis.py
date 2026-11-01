import pandas as pd
from pathlib import Path

# Step 1: Locate the Freddie Mac performance dataset
file_path = Path(r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt")

# Step 2: Check whether the file exists
if not file_path.is_file():
    print("File not found. Please check the dataset path.")

elif file_path.stat().st_size == 0:
    print("The performance dataset is empty.")

else:
    print("\nDataset found successfully!")

    # Step 3: Load only the first 1000 monthly records
    df = pd.read_csv(
        file_path, sep="|", header=None, usecols=[0, 1, 2, 3], nrows=1000, dtype=str
    )

    # Step 4: Assign column names
    df.columns = [
        "Loan ID",
        "Reporting Month",
        "Outstanding Balance",
        "Delinquency Status",
    ]

    # Step 5: Display the first five records
    print("\nMONTHLY REPAYMENT DATA")
    print(df.head().to_string(index=False))

    # Step 6: Examine the recorded delinquency values
    print("\nDELINQUENCY STATUS COUNTS")
    print(df["Delinquency Status"].value_counts(dropna=False))

    # Step 7: Convert numeric delinquency codes
    df["Delinquency Number"] = pd.to_numeric(df["Delinquency Status"], errors="coerce")

    # Step 8: Identify records showing 90+ day delinquency
    serious_delinquency = (df["Delinquency Number"] >= 3).sum()

    print("\nMONTHLY PERFORMANCE SUMMARY")
    print("Monthly Records Analysed:", len(df))
    print("Unique Mortgages:", df["Loan ID"].nunique())
    print("Records with 90+ Day Delinquency:", serious_delinquency)

    print("\nAnalysis completed!")
