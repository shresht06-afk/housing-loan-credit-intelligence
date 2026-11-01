import pandas as pd

# Step 1: Locate the monthly performance dataset

file_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"


# Step 2: Load the required columns only

df = pd.read_csv(
    file_path, sep="|", header=None, usecols=[0, 1, 3], nrows=1000, dtype=str
)

df.columns = ["Loan ID", "Reporting Month", "Delinquency Status"]


# Step 3: Select one mortgage

loan_id = "F16Q10000006"

loan_history = df[df["Loan ID"] == loan_id].copy()


# Step 4: Arrange the monthly records chronologically

loan_history = loan_history.sort_values("Reporting Month")


# Step 5: Display the repayment history

print("\nMORTGAGE REPAYMENT TIMELINE")

print("Loan ID:", loan_id)

print("\nMonthly Repayment Records:")

print(loan_history.to_string(index=False))


# Step 6: Display summary information

print("\nTIMELINE SUMMARY")

print("Months Available:", len(loan_history))

if not loan_history.empty:
    print("First Reporting Month:", loan_history["Reporting Month"].iloc[0])
    print("Last Reporting Month:", loan_history["Reporting Month"].iloc[-1])

print("\nTimeline analysis completed!")
