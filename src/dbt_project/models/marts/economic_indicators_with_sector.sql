-- models/marts/economic_indicators_with_sector.sql

{{ config(
    materialized='table'
) }}

WITH indicators AS (
    SELECT
        ei.date,
        ei.gdp_value,
        ei.unemployment_rate,
        ei.cpi_value,
        ei.consumer_spending,
        s.sector,
        s.close,
        ei.year_treasury_rate,
        ei.exchange_rate,
        ei.federal_funds_rate
    FROM {{ ref('economic_indicators') }} AS ei
    LEFT JOIN {{ ref('stg_stock_data') }} AS s ON ei.date = s.date
)

SELECT
    date,
    gdp_value,
    unemployment_rate,
    cpi_value,
    consumer_spending,
    sector,
    close AS stock_price,
    year_treasury_rate,
    exchange_rate,
    federal_funds_rate
FROM
    indicators
WHERE
    sector IS NOT NULL
