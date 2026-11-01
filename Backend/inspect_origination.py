
import pandas as pd

# Step 1: Locate the original mortgage dataset
# Enter the actual location of your downloaded file

file_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

# Step 2: Load the first 1000 mortgage records
df = pd.read_csv(
    file_path,
    sep="|",
    header=None,
    nrows=1000,
    low_memory=False
)

# Step 3: Display the dataset structure
print("DATASET INFORMATION")
print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

# Step 4: Display every column and its first value
print("\nCOLUMN INSPECTION")

for column in df.columns:
    first_value = df[column].iloc[0]
    missing = df[column].isnull().sum()

    print(
        "Column:", column,
        "| First Value:", first_value,
        "| Missing:", missing
    )
