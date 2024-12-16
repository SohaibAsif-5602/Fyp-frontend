# -- coding: utf-8 --
"""
Created on Sun Dec  8 20:16:31 2024

@author: umarn
"""

import uvicorn
from fastapi import FastAPI
from FishModels import FishModel
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends,Query
from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import text

# Create the FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.18.76:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the model, encoder, and scaler
try:
    with open('rf_fish_health_model.pkl', 'rb') as model_file:
        rf_model = pickle.load(model_file)
    with open('fish_label_encoder.pkl', 'rb') as encoder_file:
        label_encoder = pickle.load(encoder_file)
    with open('fish_scaler.pkl', 'rb') as scaler_file:
        scaler = pickle.load(scaler_file)
except FileNotFoundError as e:
    raise RuntimeError(f"Required file not found: {e}")

# Define a route to fetch fish species
@app.get('/get-fish')
def get_fish(pond_name: str = Query(None), db: Session = Depends(get_db)):
    try:
        # Create the base query
        base_query = "SELECT id, specie FROM Fishgroup"
        
        # Add a WHERE clause if pond_name is provided
        if pond_name:
            base_query += " WHERE pond_name = :pond_name"

        # Use text() to wrap the raw SQL query
        query = text(base_query)
        fish_species = db.execute(query, {"pond_name": pond_name}).fetchall()

        # Return the data in a structured format
        return {
            "fish": [{"id": row[0], "specie": row[1]} for row in fish_species]
        }
    except Exception as e:
        return {"error": str(e)}
    
# Define the /predict endpoint
@app.post('/predict')
def predict_fish_health(data: FishModel):
    try:
        # Extract data from the request
        data = data.dict()
        temperature = data['Temperature']
        turbidity = data['Turbidity']
        ph = data['PH']
        fish_name = data['Fish']

        # Scale pH slightly to boost influence
        ph_scaled = ph * 1.2

        # Encode the fish species using LabelEncoder
        fish_encoded = label_encoder.transform([fish_name])[0]

        # Prepare the input data
        input_data = pd.DataFrame([{
            'ph': ph_scaled,
            'temperature': temperature,
            'turbidity': turbidity,
            'fish': fish_encoded
        }], columns=['ph', 'temperature', 'turbidity', 'fish'])

        # Normalize the input features using MinMaxScaler
        input_data_scaled = scaler.transform(input_data)

        # Make a prediction using the random forest model
        prediction = rf_model.predict(input_data_scaled)

        # Return the prediction as a response
        return {
            'prediction': prediction[0]
        }
    except Exception as e:
        return {
            'error': str(e)
        }


# Run the app on localhost:3000
# Run the app on localhost:3000
if __name__ == '__main__':
    uvicorn.run(app, host='192.168.18.76', port=8000)
