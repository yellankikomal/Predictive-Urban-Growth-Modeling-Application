import os
import motor.motor_asyncio
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = "urban_growth_db"

client = None
db = None

# Fallback in-memory store if MongoDB is not configured
_mock_db = {
    "locations": [],
    "predictions": []
}

def get_db():
    global client, db
    if MONGODB_URI:
        if client is None:
            client = MongoClient(MONGODB_URI)
            db = client[DB_NAME]
        return db
    else:
        print("WARNING: MONGODB_URI not found. Using in-memory fallback.")
        return _mock_db

def init_db():
    get_db()

def insert_locations(data_list):
    database = get_db()
    if isinstance(database, dict):
        database["locations"] = data_list
    else:
        # Clear existing for simplicity in this prototype
        database.locations.delete_many({})
        if data_list:
            database.locations.insert_many(data_list)

def get_all_locations():
    database = get_db()
    if isinstance(database, dict):
        return database["locations"]
    else:
        return list(database.locations.find({}, {"_id": 0}))

def insert_predictions(data_list):
    database = get_db()
    if isinstance(database, dict):
        database["predictions"] = data_list
    else:
        database.predictions.delete_many({})
        if data_list:
            database.predictions.insert_many(data_list)

def get_all_predictions():
    database = get_db()
    if isinstance(database, dict):
        return database["predictions"]
    else:
        return list(database.predictions.find({}, {"_id": 0}))
