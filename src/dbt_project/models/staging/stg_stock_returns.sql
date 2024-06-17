-- models/staging/stg_stock_returns.sql
with raw_stock as (
    select
        "Date" as date,
        "Ticker" as ticker,
        "Close" as closing_price,
        lag("Close") over (partition by "Ticker" order by "Date") as prev_closing_price
    from {{ ref('raw_stock_data') }}
)
select
    date,
    ticker,
    (closing_price - prev_closing_price) / prev_closing_price as daily_return
from raw_stock
where prev_closing_price is not null