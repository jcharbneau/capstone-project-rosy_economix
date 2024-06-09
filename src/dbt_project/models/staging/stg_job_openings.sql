{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_job_openings') }}
),
cleaned as (
    select
        date,
        value as job_openings
    from raw
    where date is not null
)
select * from cleaned