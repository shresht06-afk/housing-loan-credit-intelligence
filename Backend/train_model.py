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
    average_precision_score,
    roc_auc_score,
)

# Step 1: Load our cleaned dataset

df = pd.read_csv("Data/ml_training_dataset_clean.csv")

features = ["Credit Score", "DTI", "LTV", "Interest Rate", "Loan Amount"]

X = df[features].apply(pd.to_numeric, errors="coerce")

y = df["Target"].astype(int)

print("\nMODEL TRAINING REPORT")
print("Total Mortgages:", len(df))
print("Positive Cases:", y.sum())

# Step 2: Divide data into training and testing

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print("\nTRAIN / TEST SPLIT")
print("Training Records:", len(X_train))
print("Testing Records:", len(X_test))
print("Training Positive Cases:", y_train.sum())
print("Testing Positive Cases:", y_test.sum())

# Step 3: Create model pipeline

model = Pipeline(
    [
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        (
            "classifier",
            LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42),
        ),
    ]
)

# Step 4: Train model

model.fit(X_train, y_train)

print("\nModel training completed!")

# Step 5: Make predictions

predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]

# Step 6: Evaluate model

print("\nCONFUSION MATRIX")
print(confusion_matrix(y_test, predictions))

print("\nCLASSIFICATION REPORT")
print(classification_report(y_test, predictions, zero_division=0))

print("\nROC-AUC:")
print(round(roc_auc_score(y_test, probabilities), 4))

print("\nPR-AUC (Average Precision):")
print(round(average_precision_score(y_test, probabilities), 4))

print("\nTEST POSITIVE RATE:")
print(round(y_test.mean(), 6))

# Step 7: Save model

Path("Models").mkdir(exist_ok=True)

joblib.dump(model, "Models/credit_risk_baseline.joblib")

print("\nModel saved successfully!")
print("File: Models/credit_risk_baseline.joblib")
