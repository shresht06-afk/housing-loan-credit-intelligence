import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

# Load cleaned dataset
df = pd.read_csv("Data/ml_training_dataset_clean.csv")

features = ["Credit Score", "DTI", "LTV", "Interest Rate", "Loan Amount"]

X = df[features].apply(pd.to_numeric, errors="coerce")

y = df["Target"].astype(int)

# Reproduce the same test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Load trained model
model = joblib.load("Models/credit_risk_baseline.joblib")

# Get model scores
probabilities = model.predict_proba(X_test)[:, 1]

print("\nTHRESHOLD ANALYSIS")

results = []

for threshold in [0.3, 0.5, 0.7, 0.8, 0.9]:
    predictions = (probabilities >= threshold).astype(int)

    tn, fp, fn, tp = confusion_matrix(y_test, predictions, labels=[0, 1]).ravel()

    results.append(
        {
            "Threshold": threshold,
            "Precision": round(
                precision_score(y_test, predictions, zero_division=0), 4
            ),
            "Recall": round(recall_score(y_test, predictions, zero_division=0), 4),
            "F1 Score": round(f1_score(y_test, predictions, zero_division=0), 4),
            "False Positives": fp,
            "False Negatives": fn,
            "True Positives": tp,
        }
    )

results_df = pd.DataFrame(results)

print(results_df.to_string(index=False))

results_df.to_csv("Data/threshold_analysis.csv", index=False)

print("\nThreshold analysis completed!")
