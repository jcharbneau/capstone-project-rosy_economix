import os
import pandas as pd
import requests
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# FRED API key from environment variable
api_key = os.getenv('FRED_API_KEY')
if not api_key:
    raise ValueError("Please set the FRED_API_KEY environment variable")

# List of FRED series IDs for economic indicators
indicators = {
    'GDP': 'GDP',
    'Unemployment Rate': 'UNRATE',
    'CPI': 'CPIAUCSL'
}

def fetch_fred_data(series_id):
    url = f'https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={api_key}&file_type=json'
    logging.info(f"Fetching data for series {series_id} from FRED.")
    response = requests.get(url)
    data = response.json()
    df = pd.DataFrame(data['observations'])
    df['value'] = pd.to_numeric(df['value'], errors='coerce')  # Convert to numeric, coerce errors to NaN
    df['date'] = pd.to_datetime(df['date'])
    logging.info(f"Fetched {len(df)} rows for series {series_id}.")
    return df[['date', 'value']]

# Fetch and save data to CSV in the seeds directory
seeds_dir = 'seeds'
os.makedirs(seeds_dir, exist_ok=True)

for name, series_id in indicators.items():
    df = fetch_fred_data(series_id)
    csv_file_path = os.path.join(seeds_dir, f"{name.lower().replace(' ', '_')}.csv")
    df.to_csv(csv_file_path, index=False)
    logging.info(f"Data for series {series_id} saved to {csv_file_path}")
