
import pandas as pd

# Step 1: Locate the Freddie Mac dataset
file_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

# Step 2: Load the first 1000 records
df = pd.read_csv(
    file_path,
    sep="|",
    header=None,
    nrows=1000
    )

# Step 3: Select important financial columns
financial_data = df[[0, 8, 9, 10, 11, 12, 21]].copy()

# Step 4: Give these columns meaningful names
financial_data.columns = [
    "Credit Score",
    "Original CLTV",
    "Original DTI",
    "Original Loan Balance",
    "Original LTV",
    "Original Interest Rate",
    "Original Loan Term"
]

# Step 5: Display the first five mortgage records
print("\nFINANCIAL DATASET")
print(financial_data.head().to_string(index=False))

# Step 6: Display descriptive statistics
print("\nFINANCIAL SUMMARY")
print(financial_data.describe())

# Step 7: Check missing values
print("\nMISSING VALUES")
print(financial_data.isnull().sum())
