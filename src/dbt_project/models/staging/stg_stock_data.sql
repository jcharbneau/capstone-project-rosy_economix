-- models/staging/stg_stock_data.sql

WITH base AS (
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
        "Net Income" AS net_income,
        "Average Volume" AS avg_volume,
        "PE Ratio" AS pe_ratio,
        "PS Ratio" AS ps_ratio
    FROM
        {{ ref('raw_stock_data') }}
    WHERE
        "Date" IS NOT NULL
        AND "Ticker" IS NOT NULL
),
filtered AS (
    SELECT
        date,
        ticker,
        open,
        high,
        low,
        close,
        adj_close,
        volume,
        company_name,
        industry,
        sector,
        market_cap,
        total_revenue,
        net_income,
        avg_volume,
        pe_ratio,
        ps_ratio
    FROM
        base
    WHERE
        market_cap > 0 -- Ensure market cap is positive
        AND total_revenue >= 0 -- Ensure total revenue is non-negative
        AND net_income >= 0 -- Ensure net income is non-negative
        AND open >= 0 -- Ensure open price is non-negative
        AND high >= 0 -- Ensure high price is non-negative
        AND low >= 0 -- Ensure low price is non-negative
        AND close >= 0 -- Ensure close price is non-negative
        AND adj_close >= 0 -- Ensure adj close price is non-negative
)

SELECT
    date,
    ticker,
    open,
    high,
    low,
    close,
    adj_close,
    volume,
    company_name,
    industry,
    sector,
    market_cap,
    total_revenue,
    net_income,
    avg_volume,
    pe_ratio,
    ps_ratio
FROM
    filtered
