import pandas as pd
import numpy as np
from scipy.optimize import curve_fit
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
HISTORICAL_CSV = os.path.join(DATA_DIR, "historical_population.csv")

# Logistic Growth Function (S-Curve)
# K: Carrying Capacity, r: Growth Rate, t0: Midpoint Year
def logistic_model(t, K, r, t0):
    # Prevent overflow in exp by clipping the exponent itself
    exponent = np.clip(-r * (t - t0), -500, 500)
    return K / (1 + np.exp(exponent))

def _get_model_and_data():
    if not os.path.exists(HISTORICAL_CSV):
        return None, None, None

    df = pd.read_csv(HISTORICAL_CSV)
    t = df['Year'].values
    P = df['Population'].values

    # Initial guesses:
    # K = 1.7 Billion (estimated carrying capacity of India)
    # r = 0.03 (moderate growth rate)
    # t0 = 2000 (midpoint)
    p0 = [1.7e9, 0.03, 2000]

    try:
        # Bounds: K between 1.4B and 2.0B
        popt, _ = curve_fit(logistic_model, t, P, p0=p0, bounds=([1.4e9, 0, 1950], [2.0e9, 1, 2050]), maxfev=10000)
    except Exception as e:
        print(f"Curve fit failed: {e}")
        popt = p0

    return popt, df, logistic_model

def predict_population():
    popt, df, model_func = _get_model_and_data()
    if df is None: return {"error": "Historical data not found"}

    # Future years to predict
    future_years = np.array([2030, 2040, 2050])
    predictions = model_func(future_years, *popt)

    result = []
    # Actual Data
    for year, pop in zip(df['Year'], df['Population']):
        result.append({"year": int(year), "population": int(pop), "type": "actual"})
    
    # Predicted Data
    for year, pop in zip(future_years, predictions):
        result.append({"year": int(year), "population": int(pop), "type": "predicted"})

    return result

def predict_year(year: int):
    popt, df, model_func = _get_model_and_data()
    if df is None: return {"error": "Historical data not found"}

    prediction = model_func(year, *popt)
    
    # Calculate Growth Rate vs Latest Available Year (2024)
    latest_year = int(df['Year'].max())
    base_pop = df[df['Year'] == latest_year]['Population'].values[0]
    
    total_growth = ((prediction - base_pop) / base_pop) * 100
    years_diff = year - latest_year
    avg_annual_growth = total_growth / years_diff if years_diff > 0 else 0

    return {
        "year": year,
        "population": int(prediction),
        "total_growth_vs_base": round(total_growth, 2),
        "avg_annual_growth": round(avg_annual_growth, 2),
        "base_year": latest_year,
        "is_future": year > latest_year
    }

if __name__ == "__main__":
    print(predict_population())
    print(predict_year(2060))
