{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_average_weekly_earnings') }}
),
cleaned as (
    select
        date,
        value as avg_weekly_earnings
    from raw
    where date is not null
)
select * from cleaned