import pandas as pd

file_path = r"C:\Users\shres\Downloads\sample_2016\sample_orig_2016.txt"

df = pd.read_csv(file_path, sep="|", header=None, nrows=1000)

risk_data = df[[0, 9, 11]].copy()

risk_data.columns = ["Credit Score", "DTI", "LTV"]

risk_data["DTI"] = risk_data["DTI"].replace(999, float("nan"))

high_ltv = (risk_data["LTV"] > 80).sum()

high_dti = (risk_data["DTI"] > 40).sum()

average_credit_score = risk_data["Credit Score"].mean()


print("\nHOUSING LOAN FINANCIAL ANALYSIS")

print("Total Mortgages:", len(risk_data))

print("Mortgages with LTV above 80%:", high_ltv)

print("Mortgages with DTI above 40%:", high_dti)

print("Average Credit Score:", round(average_credit_score, 2))
