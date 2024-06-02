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
),
stock_unemployment AS (
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
),
stock_cpi AS (
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
),
correlations AS (
    SELECT
        s.date,
        s.ticker,
        s.close,
        s.gdp,
        u.unemployment_rate,
        c.cpi,
        CORR(s.close, s.gdp) OVER (PARTITION BY s.ticker ORDER BY s.date) AS corr_gdp,
        CORR(s.close, u.unemployment_rate) OVER (PARTITION BY s.ticker ORDER BY s.date) AS corr_unemployment,
        CORR(s.close, c.cpi) OVER (PARTITION BY s.ticker ORDER BY s.date) AS corr_cpi
    FROM
        stock_gdp s
    JOIN
        stock_unemployment u ON s.date = u.date AND s.ticker = u.ticker
    JOIN
        stock_cpi c ON s.date = c.date AND s.ticker = c.ticker
    GROUP BY
        s.date,
        s.ticker,
        s.close,
        s.gdp,
        u.unemployment_rate,
        c.cpi
)
SELECT * FROM correlations