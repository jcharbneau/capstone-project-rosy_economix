import os
import pandas as pd
import requests
from sqlalchemy import create_engine, text
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set up database connection
engine = create_engine('postgresql://postgres:postgres@localhost:5631/pipelines')

# Ensure the schema exists
with engine.connect() as connection:
    connection.execute(text("CREATE SCHEMA IF NOT EXISTS public;"))
    logging.info("Schema 'public' checked/created.")

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

def create_table_if_not_exists(connection, table_name):
    create_table_query = text(f"""
    CREATE TABLE IF NOT EXISTS public.{table_name} (
        date DATE PRIMARY KEY,
        value FLOAT
    );
    """)
    connection.execute(create_table_query)
    logging.info(f"Table '{table_name}' checked/created.")
    connection.commit()  # Ensure the transaction is committed

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

# Fetch and load data into PostgreSQL
with engine.connect() as connection:
    for name, series_id in indicators.items():
        table_name = name.lower().replace(' ', '_')
        create_table_if_not_exists(connection, table_name)
        df = fetch_fred_data(series_id)
        logging.info(f"Starting to load {len(df)} rows into table '{table_name}'.")
        df.to_sql(table_name, engine, if_exists='replace', index=False, method='multi', chunksize=1000)
        logging.info(f"Loaded {len(df)} rows into table '{table_name}'.")

# Close the database connection
engine.dispose()
logging.info("Database connection closed.")