{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_unemployment_rate') }}
    where value is not null
),
cleaned as (
    select
        date,
        value as unemployment_rate
    from raw
    where date is not null
)
select * from cleaned
