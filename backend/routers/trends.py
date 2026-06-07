from fastapi import APIRouter
from services.forecaster import predict_population

router = APIRouter(prefix="/api/trends", tags=["trends"])

@router.get("/population")
def get_population_trends():
    return predict_population()

@router.get("/predict/{year}")
def get_year_prediction(year: int):
    from services.forecaster import predict_year
    return predict_year(year)
