from fastapi import APIRouter, HTTPException
from app.models.recommender import HybridRecommender
from app.models.forecaster import TrendForecaster

from app.database import get_engine 
router = APIRouter(prefix="/api/ai")

engine = get_engine()
recommender = HybridRecommender()
forecaster = TrendForecaster(engine)

@router.get("/recommend/{user_id}")
async def get_recommend(user_id: int):
    try:
    
        return recommender.get_recommendations(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends/all")
async def get_all_trends():
    try:
        return forecaster.predict_all_trends()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending/system")
async def get_system_trending():
    try:
        trending_ids = recommender.get_system_wide_trending(limit=12)
        return trending_ids
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/similar/{product_id}")
async def get_similar(product_id: int):
    try:
        return recommender.get_similar_products(product_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))