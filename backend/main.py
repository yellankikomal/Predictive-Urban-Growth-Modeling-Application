from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
import io

from database import init_db, insert_locations, get_all_locations, insert_predictions, get_all_predictions
from schemas import LocationData, HotspotResponse, PredictionResult
from ml_engine import ml_engine

app = FastAPI(title="Predictive Urban Growth Modeling API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.post("/upload-data")
async def upload_data(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        # Convert to dictionary
        data_list = df.to_dict(orient='records')
        
        # Save raw data to DB
        insert_locations(data_list)
        return {"message": f"Successfully uploaded {len(data_list)} locations", "count": len(data_list)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/process-data")
def process_data():
    locations = get_all_locations()
    if not locations:
        raise HTTPException(status_code=404, detail="No data found. Please upload data first.")
    
    processed_data = ml_engine.process_data(locations)
    insert_predictions(processed_data)
    
    return {"message": "Data processed successfully", "count": len(processed_data)}

@app.get("/predict-growth", response_model=List[PredictionResult])
def predict_growth():
    predictions = get_all_predictions()
    if not predictions:
        raise HTTPException(status_code=404, detail="No predictions found. Please process data first.")
    return predictions

@app.get("/get-hotspots", response_model=HotspotResponse)
def get_hotspots():
    predictions = get_all_predictions()
    if not predictions:
        raise HTTPException(status_code=404, detail="No predictions found. Please process data first.")
    
    hotspots = [p for p in predictions if p.get('is_hotspot', False)]
    # Sort by growth score descending
    hotspots = sorted(hotspots, key=lambda x: x['growth_score'], reverse=True)
    
    return HotspotResponse(hotspots=hotspots, status="success")

@app.get("/")
def read_root():
    return {"message": "Urban Growth API is running"}
