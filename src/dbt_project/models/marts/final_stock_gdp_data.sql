-- models/marts/final_stock_gdp_data.sql

with gdp_data as (
    select
        date_trunc('quarter', date) as quarter,
        gdp_growth_rate
    from {{ ref('stg_gdp') }}
    where gdp_growth_rate is not null
),
quarterly_returns as (
    select
        quarter,
        avg(avg_quarterly_return) as avg_stock_return
    from {{ ref('stg_quarterly_stock_returns') }}
    where avg_quarterly_return is not null
    group by quarter
)
select
    gdp_data.quarter,
    gdp_data.gdp_growth_rate,
    quarterly_returns.avg_stock_return
from gdp_data
left join quarterly_returns on gdp_data.quarter = quarterly_returns.quarter
where gdp_data.gdp_growth_rate is not null
  and quarterly_returns.avg_stock_return is not null
