from housing_loan import calculate_ltv

loan_amount = 4000000
property_value = 8000000

ltv = calculate_ltv(loan_amount,property_value)

print("Loan Amount:", loan_amount)
print("Property Value:", property_value)
print("Loan-to-Value Ratio:", round(ltv,2), "%")
