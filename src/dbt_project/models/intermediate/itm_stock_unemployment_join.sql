-- models/intermediate/itm_stock_unemployment_join.sql

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
unemployment_data AS (
    SELECT
        date,
        value AS unemployment_rate
    FROM
        public.raw_unemployment_rate
)
SELECT
    s.date,
    s.ticker,
    s.close,
    s.adj_close,
    s.volume,
    u.unemployment_rate
FROM
    expanded_stock_data s
JOIN
    unemployment_data u ON s.date = u.date