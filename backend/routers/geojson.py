from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/api/geojson", tags=["geojson"])

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
GEOJSON_PATH = os.path.join(DATA_DIR, "india_districts_simplified.json")

@router.get("/")
def get_districts_geojson():
    if not os.path.exists(GEOJSON_PATH):
        return {"error": "GeoJSON file not found. Please run preprocessor."}
    return FileResponse(GEOJSON_PATH)
