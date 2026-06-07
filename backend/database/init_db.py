import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from database.db import engine, Base, SessionLocal, CensusData
from services.preprocessor import load_and_clean_census_data
import pandas as pd

def init_db():
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(CensusData).count() > 0:
        print("Data already exists in the database. Skipping initialization.")
        db.close()
        return

    print("Loading data from CSV...")
    df = load_and_clean_census_data()
    
    print(f"Inserting {len(df)} records into the database...")
    for index, row in df.iterrows():
        census_entry = CensusData(
            district_code=int(row['District code']),
            state_name=row['State name'],
            district_name=row['District name'],
            population=int(row['Population']),
            male=int(row['Male']),
            female=int(row['Female']),
            literate=int(row['Literate']),
            literacy_rate=float(row['Literacy_Rate']),
            sex_ratio=float(row['Sex_Ratio']),
            urban_percentage=float(row['Urban_Percentage']),
            sc_population=int(row['SC']),
            st_population=int(row['ST']),
            workers=int(row['Workers']),
            non_workers=int(row['Non_Workers'])
        )
        db.add(census_entry)
    
    db.commit()
    db.close()
    print("Database initialization complete!")

if __name__ == "__main__":
    init_db()
