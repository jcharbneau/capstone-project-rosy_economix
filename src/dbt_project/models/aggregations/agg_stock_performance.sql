{{ config(materialized='table') }}

with stock as (
    select
        date,
        ticker,
        close as stock_price,
        volume
    from {{ ref('stg_stock_data') }}
)

select
    date,
    ticker,
    avg(stock_price) as avg_stock_price,
    sum(volume) as total_volume
from stock
group by date, ticker
order by ticker, date
