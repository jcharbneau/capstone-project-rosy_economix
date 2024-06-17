{{ config(
    materialized='table'
) }}

WITH financials AS (
    SELECT
        date,
        ticker,
        company_name,
        industry,
        sector,
        market_cap,
        total_revenue,
        net_income
    FROM {{ ref('stg_stock_data') }}
    WHERE date = (SELECT MAX(date) FROM {{ ref('stg_stock_data') }})
)

SELECT
    date,
    ticker,
    company_name,
    industry,
    sector,
    market_cap,
    total_revenue,
    net_income
FROM
    financials