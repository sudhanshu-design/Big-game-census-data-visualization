import pandas as pd
import numpy as np
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CSV_PATH = os.path.join(DATA_DIR, "india_census_2011.csv")

def load_and_clean_census_data():
    df = pd.read_csv(CSV_PATH)
    
    df.columns = df.columns.str.strip()
    
    # Calculate derived columns as per prompt
    # Literacy Rate (%) = (Literate / Population) * 100
    df['Literacy_Rate'] = (df['Literate'] / df['Population']) * 100
    
    # Sex Ratio = (Female / Male) * 1000
    df['Sex_Ratio'] = (df['Female'] / df['Male']) * 1000
    
    # Urban % 
    df['Urban_Percentage'] = (df['Urban_Households'] / df['Households']) * 100 # Approx using households if pop not direct
    # Actually the CSV has Rural_Households, Urban_Households. Let's look for population columns.
    # Looking at the CSV view: Male, Female, Literate, SC, ST, Workers...
    # It doesn't seem to have Urban Population directly in the first 20 lines.
    # I'll check the columns again.
    
    return df

if __name__ == "__main__":
    df = load_and_clean_census_data()
    print(df.head())
    print(df.columns.tolist())
