-- models/intermediate/itm_cumulative_metrics.sql

WITH base AS (
    SELECT
        date,
        ticker,
        open,
        high,
        low,
        close,
        adj_close,
        volume,
        company_name,
        industry,
        sector,
        market_cap,
        total_revenue,
        net_income
    FROM
        {{ ref('stg_raw_stock_data') }}
),
cumulative AS (
    SELECT
        ticker,
        MAX(company_name) AS company_name,
        MAX(industry) AS industry,
        MAX(sector) AS sector,
        jsonb_agg(
            jsonb_build_object(
                'date', date,
                'open', open,
                'high', high,
                'low', low,
                'close', close,
                'adj_close', adj_close,
                'volume', volume,
                'market_cap', market_cap,
                'total_rev', total_revenue,
                'net_income', net_income
            ) ORDER BY date
        ) AS metrics
    FROM
        base
    GROUP BY
        ticker
)

SELECT * FROM cumulative