# Housing Loan Credit Intelligence System

### A Student Project in Business Analytics and Credit Risk

## 1. Project Overview

The Housing Loan Credit Intelligence System is a data analytics and machine learning project designed to study historical mortgage performance and assess potential credit risk.

It combines financial data analysis, a Logistic Regression model, and a web-based interface to help users understand mortgage characteristics and historical serious delinquency patterns.

The project was developed for educational and analytical purposes and is not intended for actual lending decisions.

## 2. Project Objectives

- Analyse historical housing loan data.
- Identify relationships between mortgage characteristics and serious delinquency.
- Develop an experimental machine learning model.
- Create an interactive dashboard for exploring financial information.
- Generate understandable reports for individual mortgage assessments.

## 3. Dataset

**Source:** Freddie Mac Single-Family Mortgage Dataset — 2016 sample.

The processed labelled dataset contains:

| Measure | Value |
|---|---:|
| Labelled mortgages | 45,829 |
| Serious delinquency cases | 75 |
| Observed serious delinquency rate | Approximately 0.164% |
| Missing DTI values coded as 999 | 2,373 |

The analysis focuses on serious delinquency observed within the selected first-12-month performance window.

Target construction and treatment of incomplete loan histories remain provisional and require further validation against the official dataset documentation.

## 4. Financial Variables

The system uses five main financial inputs:

1. **Credit Score:** A measure of a borrower's creditworthiness.
2. **Debt-to-Income Ratio (DTI):** The percentage of gross monthly income allocated to debt repayments.
3. **Loan-to-Value Ratio (LTV):** The loan amount relative to property value.
4. **Interest Rate:** The mortgage interest rate.
5. **Loan Amount:** The principal amount borrowed.

The model also includes a DTI-missing indicator to handle missing DTI information.

## 5. Machine Learning Model

**Algorithm:** Logistic Regression (Version 2)

**Objective:** Experimental classification of serious mortgage delinquency.

Recorded evaluation results:

| Metric | Result |
|---|---:|
| ROC-AUC | 0.7169 |
| PR-AUC | 0.0113 |
| Positive cases in test set | 15 |
| Recall for positive cases | 53.3% |

The dataset has substantial class imbalance, with relatively few serious delinquency cases.

The model output is an experimental ranking score, **not a calibrated probability of default**.

## 6. Technology Stack

| Area | Technology |
|---|---|
| Data processing | Python, pandas |
| Machine learning | scikit-learn |
| Backend API | FastAPI |
| Frontend | Next.js, React, TypeScript |
| Data visualisation | Recharts |
| Styling | Tailwind CSS |
| Report export | Browser-based PDF printing |
| Development | VS Code / Antigravity |

## 7. Application Workspaces

### Overview

Displays historical mortgage portfolio statistics, credit-score distributions, observed delinquency patterns and model evaluation information.

### Risk Assessment

Allows users to enter mortgage details, calculate financial ratios and obtain an experimental model score.

### Analytics

Provides visual comparisons between the latest assessed mortgage and relevant historical portfolio information.

### Reports

Generates a structured mortgage assessment report containing borrower financial details, financial ratio explanations, historical comparisons and model limitations.

Reports can be exported as PDFs.

## 8. System Architecture

The frontend collects the user's mortgage details and calculates DTI and LTV.

It sends the relevant financial inputs to the FastAPI backend.

The backend processes the data through the trained machine learning pipeline and returns an experimental score.

The frontend then displays the result and makes the assessment available to the Analytics and Reports workspaces.

## 9. Local Development

### Backend

From the project root, activate the Python environment or use its Python executable.

```powershell
.venv\Scripts\python.exe -m uvicorn Backend.api:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

The frontend runs on the local address displayed by Next.js.

**Important:** The historical mortgage datasets and trained model artifact are excluded from this public repository. The backend requires the appropriate local data and `Models/credit_risk_v2.joblib` file to operate. The repository is therefore not yet a fully reproducible standalone release.

## 10. Testing

The backend was checked using a custom final system testing script.

**Automated backend tests passed:** 13 out of 13.

The checks included dataset structure, unique mortgage identifiers, target labels, corrected DTI statistics, analytics API responses, ML predictions and invalid input handling.

These checks do not establish full model validity or replace manual browser and PDF testing.

## 11. Limitations

- The analysis uses historical US mortgage data from 2016.
- Serious delinquency cases are extremely rare.
- Target construction and incomplete observation histories require further validation.
- The model has not been externally validated or calibrated for lending.
- Results cannot be directly generalised to Indian housing loans or modern mortgage portfolios.
- This system is a research and educational prototype.

## 12. Future Improvements

Potential improvements include stronger model validation, calibration, additional features, improved explainability and a reproducible dataset preparation pipeline.

---

**Project Area:** Credit Risk Analytics, Business Analytics and Machine Learning

**Purpose:** Academic learning, financial data analysis and portfolio demonstration.
