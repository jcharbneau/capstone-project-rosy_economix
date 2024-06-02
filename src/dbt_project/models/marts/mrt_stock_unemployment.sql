-- models/stock_unemployment.sql

WITH stock_unemployment AS (
    SELECT
        s."Date" AS date,
        s."Ticker" AS ticker,
        s."Close"::FLOAT AS close,
        u.value AS unemployment_rate
    FROM
        {{ ref('raw_stock_data') }} s
    JOIN
        {{ ref('unemployment_rate') }} u ON s."Date" = u.date
    WHERE
        s."Close" IS NOT NULL AND u.value IS NOT NULL
)
SELECT * FROM stock_unemployment