-- models/staging/stg_labor_force_participation_rate.sql

with source as (
    select * from {{ ref('raw_labor_force_participation_rate') }}
)

select
    date,
    value as labor_force_participation_rate
from source
