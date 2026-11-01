import pandas as pd
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    roc_auc_score,
    average_precision_score,
)

# Load original provisional dataset
df = pd.read_csv("Data/ml_training_dataset_provisional.csv")

features = ["Credit Score", "DTI", "LTV", "Interest Rate", "Loan Amount"]

X = df[features].apply(pd.to_numeric, errors="coerce").copy()

# Treat unavailable DTI as missing
X["DTI"] = X["DTI"].replace(999, float("nan"))

# Add indicator showing DTI was unavailable
X["DTI Missing"] = X["DTI"].isna().astype(int)

y = df["Target"].astype(int)

print("\nMODEL V2 TRAINING REPORT")
print("Total Mortgages:", len(df))
print("Positive Cases:", y.sum())
print("Missing DTI:", X["DTI"].isna().sum())

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Create pipeline
model = Pipeline(
    [
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        (
            "classifier",
            LogisticRegression(class_weight="balanced", max_iter=2000, random_state=42),
        ),
    ]
)

# Train
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
scores = model.predict_proba(X_test)[:, 1]

print("\nCONFUSION MATRIX")
print(confusion_matrix(y_test, predictions))

print("\nCLASSIFICATION REPORT")
print(classification_report(y_test, predictions, zero_division=0))

print("\nROC-AUC:")
print(round(roc_auc_score(y_test, scores), 4))

print("\nPR-AUC:")
print(round(average_precision_score(y_test, scores), 4))

print("\nTEST POSITIVE RATE:")
print(round(y_test.mean(), 6))

# Save model
Path("Models").mkdir(exist_ok=True)

joblib.dump(model, "Models/credit_risk_v2.joblib")

print("\nModel V2 saved successfully!")
