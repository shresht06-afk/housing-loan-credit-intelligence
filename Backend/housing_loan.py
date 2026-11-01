def calculate_ltv(loan_amount, property_value):
    if property_value == 0:
        raise ValueError("property_value cannot be zero.")
    ltv = (loan_amount / property_value) * 100
    return ltv