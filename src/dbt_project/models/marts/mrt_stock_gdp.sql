-- models/stock_gdp.sql

WITH stock_gdp AS (
    SELECT
        s."Date" AS date,
        s."Ticker" AS ticker,
        s."Close"::FLOAT AS close,
        g.value AS gdp
    FROM
        {{ ref('raw_stock_data') }} s
    JOIN
        {{ ref('gdp') }} g ON s."Date" = g.date
    WHERE
        s."Close" IS NOT NULL AND g.value IS NOT NULL
)
SELECT * FROM stock_gdp