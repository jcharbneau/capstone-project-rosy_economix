import pandas as pd
import os

# Directory containing the seed files
seed_directory = './seeds'

# Iterate over all CSV files in the directory
for filename in os.listdir(seed_directory):
    if filename.endswith('.csv'):
        filepath = os.path.join(seed_directory, filename)
        df = pd.read_csv(filepath)
        if df.isnull().values.any():
            print(f"Null values found in {filename}")
            null_columns = df.columns[df.isnull().any()]
            print(f"Columns with null values in {filename}: {list(null_columns)}")
            print(df[df.isnull().any(axis=1)])
        else:
            print(f"No null values in {filename}")
