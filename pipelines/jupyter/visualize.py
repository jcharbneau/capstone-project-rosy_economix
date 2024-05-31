import pandas as pd
import matplotlib.pyplot as plt
from sqlalchemy import create_engine

# Set up database connection
engine = create_engine('postgresql://postgres:postgres@localhost:5631/pipelines')

# Query the correlations data
query = """
SELECT ticker, corr_gdp, corr_unemployment, corr_cpi
FROM public.mrt_stock_economic_correlations WHERE ticker='AAPL'
"""
df = pd.read_sql(query, engine)

# Plot the data
fig, ax = plt.subplots(1, 3, figsize=(15, 5))

ax[0].bar(df['ticker'], df['corr_gdp'], color='b')
ax[0].set_title('Correlation with GDP')
ax[0].set_xlabel('Ticker')
ax[0].set_ylabel('Correlation')

ax[1].bar(df['ticker'], df['corr_unemployment'], color='g')
ax[1].set_title('Correlation with Unemployment Rate')
ax[1].set_xlabel('Ticker')

ax[2].bar(df['ticker'], df['corr_cpi'], color='r')
ax[2].set_title('Correlation with CPI')
ax[2].set_xlabel('Ticker')

plt.tight_layout()
plt.show()

# Close the database connection
engine.dispose()
