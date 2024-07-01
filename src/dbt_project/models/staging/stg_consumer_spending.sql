-- models/staging/stg_consumer_spending.sql

WITH raw_data AS (
    SELECT
        date,
        value AS consumer_spending
    FROM {{ ref('raw_consumer_spending') }}
    WHERE value IS NOT NULL  -- Filter out rows where the consumer spending value is null
)

SELECT
    date,
    consumer_spending
FROM raw_data
