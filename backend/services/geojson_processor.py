import json
import os
import pandas as pd
import geopandas as gpd

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
GEOJSON_PATH = os.path.join(DATA_DIR, "india_district.geojson")
CSV_PATH = os.path.join(DATA_DIR, "india_census_2011.csv")
OUTPUT_PATH = os.path.join(DATA_DIR, "india_districts_simplified.json")

def process_geojson():
    print("Loading GeoJSON (34MB, please wait)...")
    gdf = gpd.read_file(GEOJSON_PATH)
    
    print("Loading Census CSV...")
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    
    # Pre-calculate metrics to include in GeoJSON
    df['Literacy_Rate'] = (df['Literate'] / df['Population'] * 100).round(2)
    df['Sex_Ratio'] = (df['Female'] / df['Male'] * 1000).round(2)
    
    # Keep only essential columns for the map to save space
    census_subset = df[['District name', 'State name', 'Population', 'Literacy_Rate', 'Sex_Ratio']]
    
    # Standardize names for merging
    # We'll try to find the best column in GeoJSON
    potential_keys = ['district', 'NAME_2', 'DISTRICT', 'District']
    merge_key = None
    for key in potential_keys:
        if key in gdf.columns:
            merge_key = key
            break
    
    if not merge_key:
        print(f"Warning: Could not find district key in GeoJSON columns: {gdf.columns.tolist()}")
        # Fallback to the first object-type column that isn't State
        for col in gdf.select_dtypes(include=['object']).columns:
            if 'state' not in col.lower():
                merge_key = col
                break
    
    print(f"Merging on GeoJSON key: {merge_key}")
    
    # Merge data
    gdf[merge_key] = gdf[merge_key].str.upper()
    census_subset['District name'] = census_subset['District name'].str.upper()
    
    merged = gdf.merge(census_subset, left_on=merge_key, right_on='District name', how='left')
    
    # Simplify geometry to reduce file size significantly
    print("Simplifying geometry (tolerance=0.01)...")
    merged['geometry'] = merged.geometry.simplify(0.01)
    
    # Convert to GeoJSON and save
    print(f"Saving simplified GeoJSON to {OUTPUT_PATH}...")
    # Remove rows with null geometry if any
    merged = merged[merged.geometry.notnull()]
    
    # Convert to JSON string and then save
    merged.to_file(OUTPUT_PATH, driver='GeoJSON')
    print("Done!")

if __name__ == "__main__":
    process_geojson()
