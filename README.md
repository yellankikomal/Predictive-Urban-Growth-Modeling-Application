# Predictive Urban Growth Modeling Application

A full-stack real estate predictive analytics platform built with React, FastAPI, scikit-learn, and MongoDB. This app ingests real estate data and identifies future growth hotspots using a hybrid formula-based and machine-learning approach.

## 🚀 Features
- **Data Ingestion**: Upload real estate CSV data.
- **Predictive Engine**: Hybrid scoring model (Infrastructure + Price Growth + Density + Rental Yield) with a Random Forest fallback.
- **Interactive Map**: Visualize predictions with heat/growth markers using Leaflet.
- **Modern UI**: Glassmorphism aesthetic and responsive design.

---

## 🛠️ Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (Local instance or MongoDB Atlas account)

---

## 📦 Step-by-Step Setup Instructions

### 1. Database Setup (MongoDB Atlas)
By default, the backend will use an **in-memory mock database** if MongoDB is not configured, which is great for quick testing. 
To use MongoDB Atlas:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0...`).
3. In the `backend` folder, create a `.env` file and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *The API will be available at `http://localhost:8000`. You can view the docs at `http://localhost:8000/docs`.*

### 3. Frontend Setup
1. Open a **new terminal window** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run at `http://localhost:5173`.*

---

## 🧪 Testing the Application

1. Open your browser and go to the frontend URL (e.g., `http://localhost:5173`).
2. **Upload Data**: In the sidebar, click "Choose CSV File" and select the provided sample data: `data/mock_bangalore_data.csv`. Then click **Upload Data**.
3. **Process**: Click **Process & Engineer Features** to run the scoring formula and ML model on the uploaded data.
4. **Predict**: Click **Generate Predictions** to render the results on the interactive map.
5. **Explore**: 
   - Click on the hotspots in the sidebar to fly directly to them on the map.
   - Click on the map markers to view detailed prediction stats.

---

## 📂 Project Structure
- `/backend`: FastAPI Python server, ML logic (`ml_engine.py`), and optional MongoDB connection (defaults to in-memory storage).
- `/frontend`: React + Vite application with Leaflet maps.
- `/data`: Contains `mock_bangalore_data.csv` for easy testing.
