from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db, CensusData
from fastapi_cache.decorator import cache

router = APIRouter(prefix="/api/overview", tags=["overview"])

@router.get("/")
@cache(expire=3600)
def get_overview(db: Session = Depends(get_db)):
    total_pop = db.query(func.sum(CensusData.population)).scalar() or 0
    avg_literacy = db.query(func.avg(CensusData.literacy_rate)).scalar() or 0
    total_male = db.query(func.sum(CensusData.male)).scalar() or 1
    total_female = db.query(func.sum(CensusData.female)).scalar() or 0
    sex_ratio = (total_female / total_male) * 1000
    
    # Urban vs Rural Split (Approx using households for now if pop not available)
    # Actually, if I want to be accurate, I should add urban/rural pop columns to model
    
    most_populated_state = db.query(
        CensusData.state_name, func.sum(CensusData.population).label("total_pop")
    ).group_by(CensusData.state_name).order_by(func.sum(CensusData.population).desc()).first()

    least_populated_state = db.query(
        CensusData.state_name, func.sum(CensusData.population).label("total_pop")
    ).group_by(CensusData.state_name).order_by(func.sum(CensusData.population).asc()).first()

    return {
        "total_population": int(total_pop),
        "avg_literacy_rate": float(round(avg_literacy, 2)),
        "sex_ratio": float(round(sex_ratio, 2)),
        "most_populated_state": str(most_populated_state[0]) if most_populated_state else "N/A",
        "least_populated_state": str(least_populated_state[0]) if least_populated_state else "N/A"
    }
