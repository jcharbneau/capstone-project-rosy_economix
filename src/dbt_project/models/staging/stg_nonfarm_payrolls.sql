
{{ config(materialized='view') }}

with raw as (
    select *
    from {{ ref('raw_nonfarm_payrolls') }}
),
cleaned as (
    select
        date,
        value as nonfarm_payrolls
    from raw
    where date is not null
)
select * from cleaned