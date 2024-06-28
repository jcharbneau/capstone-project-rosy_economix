-- models/staging/stg_quarterly_stock_returns.sql

{{ config(materialized='table') }}

with daily_returns as (
    select
        date,
        ticker,
        daily_return,
        date_trunc('quarter', date) as quarter
    from {{ ref('stg_stock_returns') }}
    where daily_return is not null
)
select
    quarter,
    ticker,
    avg(daily_return) as avg_quarterly_return
from daily_returns
group by quarter, ticker
