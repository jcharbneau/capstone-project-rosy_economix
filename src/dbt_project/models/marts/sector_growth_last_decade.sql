WITH recent_stock_data AS (
    SELECT
        date,
        sector,
        EXTRACT(YEAR FROM date) AS year,
        adj_close AS stock_price
    FROM
        {{ ref('stg_stock_data') }}
    WHERE
        date >= CURRENT_DATE - INTERVAL '10 years'
),

yearly_stock_prices AS (
    SELECT
        year,
        sector,
        MAX(stock_price) AS max_stock_price,
        MIN(stock_price) AS min_stock_price
    FROM
        recent_stock_data
    GROUP BY
        year, sector
    HAVING
        MIN(stock_price) > 0
),

yearly_sector_growth AS (
    SELECT
        year,
        sector,
        max_stock_price,
        min_stock_price,
        ((max_stock_price - min_stock_price) / min_stock_price * 100) AS yearly_growth_percentage
    FROM
        yearly_stock_prices
),

top_sectors AS (
    SELECT
        sector,
        AVG(yearly_growth_percentage) AS avg_growth_percentage
    FROM
        yearly_sector_growth
    GROUP BY
        sector
    ORDER BY
        avg_growth_percentage DESC
    LIMIT 5
),

filtered_stock_data AS (
    SELECT
        date,
        sector,
        stock_price
    FROM
        recent_stock_data
    WHERE
        sector IN (SELECT sector FROM top_sectors)
),

daily_stock_prices AS (
    SELECT
        date,
        sector,
        MAX(stock_price) AS max_stock_price,
        MIN(stock_price) AS min_stock_price
    FROM
        filtered_stock_data
    GROUP BY
        date, sector
    HAVING
        MIN(stock_price) > 0
),

sector_daily_growth AS (
    SELECT
        date,
        sector,
        max_stock_price,
        min_stock_price,
        COALESCE(((max_stock_price - min_stock_price) / min_stock_price * 100), 0) AS growth_percentage
    FROM
        daily_stock_prices
)

SELECT
    date,
    sector,
    max_stock_price,
    min_stock_price,
    CAST(growth_percentage AS FLOAT) AS growth_percentage
FROM
    sector_daily_growth
ORDER BY
    sector, date
