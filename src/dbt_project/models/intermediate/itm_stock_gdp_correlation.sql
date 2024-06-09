WITH stock_gdp AS (
    SELECT
        s."Date" AS date,
        s."Ticker" AS ticker,
        s."Close"::FLOAT AS close,
        g.value AS gdp
    FROM
        {{ ref('raw_stock_data') }} s
    JOIN
        {{ ref('raw_gdp') }} g ON s."Date" = g.date
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
        {{ ref('raw_unemployment_rate') }} u ON s."Date" = u.date
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
        {{ ref('raw_cpi') }} c ON s."Date" = c.date
),
correlations AS (
    SELECT
        s.ticker,
        CORR(s.close, s.gdp) AS corr_gdp,
        CORR(s.close, u.unemployment_rate) AS corr_unemployment,
        CORR(s.close, c.cpi) AS corr_cpi
    FROM
        stock_gdp s
    JOIN
        stock_unemployment u ON s.date = u.date AND s.ticker = u.ticker
    JOIN
        stock_cpi c ON s.date = c.date AND s.ticker = c.ticker
    GROUP BY
        s.ticker
)
SELECT * FROM correlations