import psycopg2
import pandas as pd
import plotly.express as px

# Database connection parameters
db_params = {
    'dbname': 'pipelines',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5631'
}
# Database connection details
# DB_HOST = os.getenv('DB_HOST', 'localhost')
# DB_PORT = os.getenv('DB_PORT', '5631')
# DB_USER = os.getenv('DB_USER', 'postgres')
# DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
# DB_NAME = os.getenv('DB_NAME', 'pipelines')
# Query to fetch data
query = """
SELECT date, ticker, price
FROM mrt_stock_economic_correlations
WHERE ticker IN ('AAPL', 'S&P 500')
ORDER BY date
"""

# Connect to the PostgreSQL database
try:
    conn = psycopg2.connect(**db_params)
    print("Connected to the database successfully")
except Exception as e:
    print(f"Unable to connect to the database: {e}")
    exit()

# Fetch the data into a pandas DataFrame
try:
    df = pd.read_sql(query, conn)
    print("Data fetched successfully")
except Exception as e:
    print(f"Error fetching data: {e}")
    conn.close()
    exit()

# Close the database connection
conn.close()

# Pivot the DataFrame to have tickers as columns
df_pivot = df.pivot(index='date', columns='ticker', values='price').reset_index()

# Plot
fig = px.scatter(
    df_pivot,
    x='date',
    y='AAPL',
    size='S&P 500',
    color='S&P 500',
    title='AAPL Price vs S&P 500 Size'
)
fig.update_layout(
    xaxis_title='Date',
    yaxis_title='AAPL Price',
    legend_title='S&P 500'
)
fig.show()
