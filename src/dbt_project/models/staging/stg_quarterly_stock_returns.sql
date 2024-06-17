-- models/staging/stg_quarterly_stock_returns.sql
with daily_returns as (
    select
        date,
        ticker,
        daily_return,
        date_trunc('quarter', date) as quarter
    from {{ ref('stg_stock_returns') }}
)
select
    quarter,
    ticker,
    avg(daily_return) as avg_quarterly_return
from daily_returns
group by quarter, ticker