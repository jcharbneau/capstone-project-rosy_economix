-- models/marts/economic_indicators.sql

{{ config(
    materialized='table'
) }}

WITH indicators AS (
    SELECT
        gdp.date,
        gdp.gdp_value,
        ur.unemployment_rate,
        cpi.cpi_value,
        cs.consumer_spending
    FROM {{ ref('stg_gdp') }} AS gdp
    LEFT JOIN {{ ref('stg_unemployment_rate') }} AS ur ON gdp.date = ur.date
    LEFT JOIN {{ ref('stg_cpi') }} AS cpi ON gdp.date = cpi.date
    LEFT JOIN {{ ref('stg_consumer_spending') }} AS cs ON gdp.date = cs.date
)

SELECT
    date,
    gdp_value,
    unemployment_rate,
    cpi_value,
    consumer_spending
FROM
    indicators
