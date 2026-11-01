import pandas as pd 

file_path = r'C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt'

df = pd.read_csv(
    file_path,
    sep="|",
    header=None,
    nrows=1000
)

print("Dataset Shape:", df.shape)

print("\nFirst 5 Records:")
print(df.head())

print("\nMissing Values:")
print(df.isnull().sum())