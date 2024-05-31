-- models/intermediate/itm_stock_gdp_join.sql

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
gdp_data AS (
    SELECT
        date,
        value AS gdp
    FROM
        public.gdp
)
SELECT
    s.date,
    s.ticker,
    s.close,
    s.adj_close,
    s.volume,
    g.gdp
FROM
    expanded_stock_data s
JOIN
    gdp_data g ON s.date = g.date