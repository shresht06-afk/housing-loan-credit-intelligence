import pandas as pd
import matplotlib.pyplot as plt

# Step 1: Locate our dataset
file_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

# Step 2: Load the first 1000 mortgage records
df = pd.read_csv(file_path, sep="|", header=None, nrows=1000)

# Step 3: Select the required financial columns
financial_data = df[[0, 9, 11]].copy()

# Step 4: Assign meaningful names
financial_data.columns = ["Credit Score", "DTI", "LTV"]

# Step 5: Clean unavailable DTI values
financial_data["DTI"] = financial_data["DTI"].replace(999, float("nan"))

# Step 6: Credit Score Distribution
plt.figure(figsize=(8, 5))

plt.hist(financial_data["Credit Score"], bins=20, edgecolor="black")

plt.title("Credit Score Distribution")
plt.xlabel("Credit Score")
plt.ylabel("Number of Mortgages")

plt.tight_layout()
plt.show()


# Step 7: Loan-to-Value Distribution
plt.figure(figsize=(8, 5))

plt.hist(financial_data["LTV"], bins=20, edgecolor="black")

plt.title("Loan-to-Value Distribution")
plt.xlabel("Original LTV (%)")
plt.ylabel("Number of Mortgages")

plt.tight_layout()
plt.show()


# Step 8: Debt-to-Income Distribution
plt.figure(figsize=(8, 5))

plt.hist(financial_data["DTI"].dropna(), bins=20, edgecolor="black")

plt.title("Debt-to-Income Distribution")
plt.xlabel("Original DTI (%)")
plt.ylabel("Number of Mortgages")

plt.tight_layout()
plt.show()

print("\nAll three financial charts generated successfully!")
