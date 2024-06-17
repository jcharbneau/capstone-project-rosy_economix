-- models/staging/stg_stock_data.sql

SELECT
    "Date" AS date,
    "Ticker" AS ticker,
    "Open" AS open,
    "High" AS high,
    "Low" AS low,
    "Close" AS close,
    "Adj Close" AS adj_close,
    "Volume" AS volume,
    "Company Name" AS company_name,
    "Industry" AS industry,
    "Sector" AS sector,
    "Market Cap" AS market_cap,
    "Total Revenue" AS total_revenue,
    "Net Income" AS net_income
FROM
    {{ ref('raw_stock_data') }}
WHERE
    "Date" IS NOT NULL
    AND "Ticker" IS NOT NULL
