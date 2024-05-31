-- models/intermediate/itm_stock_cpi_join.sql

WITH stock_data AS (
    SELECT
        ticker,
        jsonb_array_elements(metrics) AS metric
    FROM
        {{ ref('itm_cumulative_metrics') }}
),
expanded_stock_data AS (
    SELECT
        ticker,
        (metric->>'date')::date AS date,
        metric->>'close' AS close,
        metric->>'adj_close' AS adj_close,
        metric->>'volume' AS volume
    FROM
        stock_data
),
cpi_data AS (
    SELECT
        date,
        value AS cpi
    FROM
        public.cpi
)
SELECT
    s.date,
    s.ticker,
    s.close,
    s.adj_close,
    s.volume,
    c.cpi
FROM
    expanded_stock_data s
JOIN
    cpi_data c ON s.date = c.date