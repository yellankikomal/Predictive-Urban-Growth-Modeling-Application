from pydantic import BaseModel
from typing import List, Optional

class LocationData(BaseModel):
    location: str
    latitude: float
    longitude: float
    current_price_sqft: float
    price_growth_rate: float
    rental_yield: float
    listing_density: float
    infrastructure_score: float

class PredictionResult(BaseModel):
    location: str
    latitude: float
    longitude: float
    growth_score: float
    prediction_ml: Optional[float] = None
    is_hotspot: bool

class HotspotResponse(BaseModel):
    hotspots: List[PredictionResult]
    status: str
