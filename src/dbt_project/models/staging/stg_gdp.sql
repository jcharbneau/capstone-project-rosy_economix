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
)
select * from cleaned