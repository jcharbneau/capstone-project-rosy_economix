-- models/marts/final_stock_gdp_data.sql
with gdp_data as (
    select
        date_trunc('quarter', date) as quarter,
        gdp_growth_rate
    from {{ ref('stg_gdp') }}
),
quarterly_returns as (
    select
        quarter,
        avg(avg_quarterly_return) as avg_stock_return
    from {{ ref('stg_quarterly_stock_returns') }}
    group by quarter
)
select
    gdp_data.quarter,
    gdp_data.gdp_growth_rate,
    quarterly_returns.avg_stock_return
from gdp_data
left join quarterly_returns on gdp_data.quarter = quarterly_returns.quarter