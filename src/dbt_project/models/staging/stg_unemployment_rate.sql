-- models/staging/stg_unemployment_rate.sql

{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_unemployment_rate') }}
),
cleaned as (
    select
        date,
        value as unemployment_rate
    from raw
    where date is not null
)
select * from cleaned
