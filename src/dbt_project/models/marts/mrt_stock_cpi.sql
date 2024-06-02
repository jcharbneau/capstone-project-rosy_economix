-- models/stock_cpi.sql

WITH stock_cpi AS (
    SELECT
        s."Date" AS date,
        s."Ticker" AS ticker,
        s."Close"::FLOAT AS close,
        c.value AS cpi
    FROM
        {{ ref('raw_stock_data') }} s
    JOIN
        {{ ref('cpi') }} c ON s."Date" = c.date
    WHERE
        s."Close" IS NOT NULL AND c.value IS NOT NULL
)
SELECT * FROM stock_cpi