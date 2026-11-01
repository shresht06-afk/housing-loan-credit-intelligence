import pandas as pd

file_path = r"C:\Users\shres\Downloads\sample_2016\sample_perf_2016.txt"

df = pd.read_csv(file_path, sep="|", header=None, nrows=5, dtype=str)

print("Rows:", df.shape[0])
print("Columns:", df.shape[1])

print("\nFIRST PERFORMANCE RECORD")

for column in df.columns:
    print("Column:", column, "| Value:", df[column].iloc[0])
