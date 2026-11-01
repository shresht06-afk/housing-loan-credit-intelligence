import pandas as pd
from pathlib import Path

# Step 1: Locate the monthly performance dataset
file_path = Path(r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt")

# Step 2: Check whether the file exists
print("\nMONTHLY PERFORMANCE DATASET")

if not file_path.is_file():
    print("Dataset not found. Please check the file path.")

elif file_path.stat().st_size == 0:
    print("The dataset exists, but it is empty.")

else:
    print("Dataset found successfully!")
    print("File size (MB):", round(file_path.stat().st_size / (1024 * 1024), 2))

    # Step 3: Read only the first five records
    df = pd.read_csv(file_path, sep="|", header=None, nrows=5, dtype=str)

    # Step 4: Display the dataset structure
    print("\nTotal columns:", df.shape[1])
    print("Records loaded:", df.shape[0])

    # Step 5: Display the first record vertically
    print("\nFIRST MORTGAGE PERFORMANCE RECORD")

    for column in df.columns:
        print("Column", column, ":", df[column].iloc[0])

    print("\nPerformance dataset inspection completed!")
