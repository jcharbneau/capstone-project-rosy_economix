

{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_total_wages_and_salaries') }}
),
cleaned as (
    select
        date,
        value as total_wages_and_salaries
    from raw
    where date is not null
)
select * from cleaned