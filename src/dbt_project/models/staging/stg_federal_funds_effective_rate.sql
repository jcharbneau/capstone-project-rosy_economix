-- models/staging/stg_federal_funds_effective_rate.sql

with data as (
    select * from {{ ref('raw_federal_funds_effective_rate') }}
)

select
    date,
    value as federal_funds_rate
from data
