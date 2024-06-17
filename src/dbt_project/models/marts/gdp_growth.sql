with gdp as (
    select
        date,
        value as gdp_growth
    from {{ ref('raw_gdp') }}
)
select
    date_trunc('quarter', date) as quarter,
    avg(gdp_growth) as avg_gdp_growth
from gdp
group by 1
order by 1