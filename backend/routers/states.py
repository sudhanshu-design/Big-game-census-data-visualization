from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db, CensusData, SessionLocal
from functools import lru_cache
from fastapi_cache.decorator import cache

router = APIRouter(prefix="/api/states", tags=["states"])

@lru_cache(maxsize=1)
def get_cached_districts():
    db = SessionLocal()
    try:
        rows = db.query(
            CensusData.district_code,
            CensusData.district_name,
            CensusData.state_name,
            CensusData.population
        ).all()
        # Explicitly convert to dictionaries for FastAPI serialization
        return [
            {
                "district_code": r.district_code,
                "district_name": r.district_name,
                "state_name": r.state_name,
                "population": r.population
            } for r in rows
        ]
    finally:
        db.close()

@router.get("/")
@cache(expire=3600)
def get_states_data(db: Session = Depends(get_db)):
    states = db.query(
        CensusData.state_name,
        func.sum(CensusData.population).label("population"),
        func.avg(CensusData.literacy_rate).label("literacy"),
        func.sum(CensusData.female).label("female"),
        func.sum(CensusData.male).label("male"),
        func.avg(CensusData.urban_percentage).label("urban_percentage")
    ).group_by(CensusData.state_name).all()

    result = []
    for state in states:
        sex_ratio = (state.female / state.male) * 1000 if state.male > 0 else 0
        result.append({
            "state": state.state_name,
            "population": int(state.population),
            "literacy": round(state.literacy, 2),
            "sex_ratio": round(sex_ratio, 2),
            "urban_percentage": round(state.urban_percentage, 2)
        })
    
    return result

@router.get("/districts/all")
def get_all_districts():
    return get_cached_districts()

@router.get("/{state_name}/districts")
def get_districts_by_state(state_name: str, db: Session = Depends(get_db)):
    districts = db.query(CensusData).filter(CensusData.state_name == state_name.upper()).all()
    return districts

@router.get("/districts/{district_code}")
def get_district_detail(district_code: int, db: Session = Depends(get_db)):
    district = db.query(CensusData).filter(CensusData.district_code == district_code).first()
    return district
