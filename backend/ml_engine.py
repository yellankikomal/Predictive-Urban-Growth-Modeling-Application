import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
import traceback

class MLEngine:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = MinMaxScaler()
        self.is_trained = False

    def calculate_formula_score(self, row):
        # Growth Score = (0.4 × infrastructure) + (0.3 × price_growth) + (0.2 × density) + (0.1 × rental_yield)
        score = (0.4 * row['infrastructure_score'] +
                 0.3 * row['price_growth_rate'] +
                 0.2 * (row['listing_density'] / 10) + # normalize density to 0-10 roughly
                 0.1 * row['rental_yield'])
        return score

    def process_data(self, data_list):
        if not data_list:
            return []
            
        df = pd.DataFrame(data_list)
        
        # Calculate formula-based score
        df['growth_score'] = df.apply(self.calculate_formula_score, axis=1)
        
        # Prepare features for ML if enough data exists
        features = ['infrastructure_score', 'price_growth_rate', 'listing_density', 'rental_yield', 'current_price_sqft']
        
        try:
            # We use formula score as the target variable for the mock ML model
            # In a real scenario, this would be historical growth data
            X = self.scaler.fit_transform(df[features])
            y = df['growth_score']
            
            # Train model
            if len(df) >= 5: # Need minimum data to train
                self.model.fit(X, y)
                self.is_trained = True
                
                # Predict
                predictions = self.model.predict(X)
                df['prediction_ml'] = predictions
            else:
                df['prediction_ml'] = None
                
        except Exception as e:
            print(f"ML Model training failed: {e}")
            traceback.print_exc()
            df['prediction_ml'] = None

        # Determine hotspots (top 30% or score > threshold)
        threshold = df['growth_score'].quantile(0.7)
        df['is_hotspot'] = df['growth_score'] >= threshold
        
        return df.to_dict(orient='records')

ml_engine = MLEngine()
