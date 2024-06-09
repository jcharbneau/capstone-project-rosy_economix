{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_employment_cost_index') }}
),
cleaned as (
    select
        date,
        value as employment_cost_index
    from raw
    where date is not null
)
select * from cleaned