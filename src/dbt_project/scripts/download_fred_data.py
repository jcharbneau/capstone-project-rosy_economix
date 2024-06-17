import os
import pandas as pd
import requests
import logging
from datetime import datetime

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
    'CPI': 'CPIAUCSL',
    'Nonfarm Payrolls': 'PAYEMS',
    'Job Openings': 'JTSJOL',
    'Average Hourly Earnings': 'AHETPI',
    'Total Wages and Salaries': 'BA06RC1A027NBEA',
    'Employment Cost Index': 'ECIWAG',
    'Average Weekly Earnings': 'CES0500000011'
}


def fetch_fred_data(series_id):
    url = f'https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={api_key}&file_type=json'
    logging.info(f"Fetching data for series {series_id} from FRED.")
    response = requests.get(url)
    if response.status_code != 200:
        logging.error(f"Failed to fetch data for series {series_id}. Status code: {response.status_code}")
        return pd.DataFrame()

    data = response.json()
    if 'observations' not in data:
        logging.error(f"No 'observations' found for series {series_id}. Response: {data}")
        return pd.DataFrame()

    df = pd.DataFrame(data['observations'])
    df['value'] = pd.to_numeric(df['value'], errors='coerce')  # Convert to numeric, coerce errors to NaN
    df['date'] = pd.to_datetime(df['date'])
    logging.info(f"Fetched {len(df)} rows for series {series_id}.")
    return df[['date', 'value']]


def save_data_to_csv(data, filename):
    seeds_dir = 'seeds'
    os.makedirs(seeds_dir, exist_ok=True)
    file_path = os.path.join(seeds_dir, filename)
    data.to_csv(file_path, index=False)
    logging.info(f"Data saved to {file_path}")


# Fetch and save data to CSV in the seeds directory
for name, series_id in indicators.items():
    df = fetch_fred_data(series_id)
    if df.empty:
        logging.error(f"Skipping {name} due to data fetch error.")
        continue
    filename = f"raw_{name.lower().replace(' ', '_')}.csv"
    save_data_to_csv(df, filename)

logging.info("Data fetching and saving process completed.")