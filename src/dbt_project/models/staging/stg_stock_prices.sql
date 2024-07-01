-- models/staging/stg_stock_prices.sql

WITH raw AS (
    SELECT
        "Ticker" as ticker,
        "Date" as date,
        "Adj Close" as stock_price,
        "Close" as close,
        "Sector" as sector
        -- Add other relevant columns if needed
        -- Add any necessary cleaning and transformation steps here
    FROM {{ ref('raw_stock_data') }}
    WHERE "Close" IS NOT NULL  -- Filter out rows with null close prices
)

SELECT * FROM raw
