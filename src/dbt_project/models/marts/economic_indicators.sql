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
        cs.consumer_spending,
        t10.year_treasury_rate,
        eur_usd.exchange_rate,
        fed_rate.federal_funds_rate
    FROM {{ ref('stg_gdp') }} AS gdp
    LEFT JOIN {{ ref('stg_unemployment_rate') }} AS ur ON gdp.date = ur.date
    LEFT JOIN {{ ref('stg_cpi') }} AS cpi ON gdp.date = cpi.date
    LEFT JOIN {{ ref('stg_consumer_spending') }} AS cs ON gdp.date = cs.date
    LEFT JOIN {{ ref('stg_10_year_treasury_constant_maturity_rate') }} AS t10 ON gdp.date = t10.date
    LEFT JOIN {{ ref('stg_exchange_rate_usd_to_eur') }} AS eur_usd ON gdp.date = eur_usd.date
    LEFT JOIN {{ ref('stg_federal_funds_effective_rate') }} AS fed_rate ON gdp.date = fed_rate.date
)

SELECT
    date,
    gdp_value,
    unemployment_rate,
    cpi_value,
    consumer_spending,
    year_treasury_rate,
    exchange_rate,
    federal_funds_rate
FROM
    indicators
