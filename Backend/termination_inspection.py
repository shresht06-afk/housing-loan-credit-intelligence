import pandas as pd

# Step 1: Locate the original performance dataset

file_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"


# Step 2: Load only five records

df = pd.read_csv(file_path, sep="|", header=None, nrows=5, dtype=str)


# Step 3: Display the number of columns

print("\nPERFORMANCE DATASET STRUCTURE")

print("Total Columns:", df.shape[1])


# Step 4: Display each column and its first value

print("\nFIRST PERFORMANCE RECORD")

for column in df.columns:
    print("Column", column, ":", df[column].iloc[0])


print("\nTermination inspection completed!")
