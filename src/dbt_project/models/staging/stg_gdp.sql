{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_gdp') }}
),
cleaned as (
    select
        date,
        value as gdp_value
    from raw
    where date is not null
      and value is not null
),
growth_calculation as (
    select
        date,
        gdp_value,
        lag(gdp_value) over (order by date) as prev_gdp_value
    from cleaned
)
select
    date,
    gdp_value,
    (gdp_value - prev_gdp_value) / prev_gdp_value as gdp_growth_rate
from growth_calculation
where prev_gdp_value is not null