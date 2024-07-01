-- models/staging/stg_underemployment_rate.sql

with source as (
    select * from {{ ref('raw_underemployment_rate') }}
)

select
    date,
    value as underemployment_rate
from source
