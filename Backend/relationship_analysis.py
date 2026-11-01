import pandas as pd
import matplotlib.pyplot as plt

# Step 1: Locate the Freddie Mac dataset
file_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

# Step 2: Load the first 1000 mortgage records
df = pd.read_csv(file_path, sep="|", header=None, nrows=1000)

# Step 3: Select important financial variables
financial_data = df[[0, 9, 11, 12]].copy()

# Step 4: Assign meaningful column names
financial_data.columns = ["Credit Score", "DTI", "LTV", "Interest Rate"]

# Step 5: Clean unavailable DTI values
financial_data["DTI"] = financial_data["DTI"].replace(999, float("nan"))

# Step 6: Generate a scatter plot
plt.figure(figsize=(8, 5))

plt.scatter(financial_data["LTV"], financial_data["DTI"], alpha=0.5)

plt.title("Relationship Between LTV and DTI")
plt.xlabel("Original Loan-to-Value (%)")
plt.ylabel("Original Debt-to-Income (%)")

plt.tight_layout()
plt.show()

# Step 7: Calculate the correlation matrix
correlation_matrix = financial_data.corr()

print("\nFINANCIAL CORRELATION MATRIX")
print(correlation_matrix.round(2))

# Step 8: Visualise the correlation matrix
plt.figure(figsize=(8, 6))

plt.imshow(correlation_matrix, cmap="coolwarm", vmin=-1, vmax=1)

plt.colorbar(label="Correlation Coefficient")

plt.xticks(
    range(len(correlation_matrix.columns)),
    correlation_matrix.columns,
    rotation=45,
    ha="right",
)

plt.yticks(range(len(correlation_matrix.columns)), correlation_matrix.columns)

# Display correlation values inside the chart
for i in range(len(correlation_matrix.columns)):
    for j in range(len(correlation_matrix.columns)):
        plt.text(
            j, i, round(correlation_matrix.iloc[i, j], 2), ha="center", va="center"
        )

plt.title("Financial Correlation Matrix")
plt.tight_layout()
plt.show()

print("\nFinancial relationship analysis completed!")
