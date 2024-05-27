
import os
from fredapi import Fred

# Your FRED API key
FRED_API_KEY = 'your_api_key_here'

# Initialize the Fred API
fred = Fred(api_key=FRED_API_KEY)

# Directory containing your CSV files
directory = '.'

# Function to get the dataset name from FRED
def get_dataset_name(fred_id):
    try:
        series_info = fred.get_series_info(fred_id)
        return series_info['title']
    except Exception as e:
        print(f"Error retrieving data for {fred_id}: {e}")
        return None

# Iterate over the files in the directory
for filename in os.listdir(directory):
    if filename.endswith('.csv'):
        fred_id = filename.split('.')[0]
        dataset_name = get_dataset_name(fred_id)
        if dataset_name:
            print(f"File: {filename} -> Dataset Name: {dataset_name}")
        else:
            print(f"File: {filename} -> Dataset Name: Not Found")
