with stock as (
    select
        "Date" as date,
        "Ticker" as ticker,
        "Close" as stock_close
    from {{ ref('raw_stock_data') }}
)
select
    date_trunc('quarter', date) as quarter,
    avg(stock_close) as avg_stock_close
from stock
-- where ticker in ('AAPL', 'MSFT', 'GOOGL')  -- Include your 139 stock tickers here
group by 1
order by 1