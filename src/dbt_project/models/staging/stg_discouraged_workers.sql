-- models/staging/stg_discouraged_workers.sql

with source as (
    select * from {{ ref('raw_discouraged_workers') }}
)

select
    date,
    value as discouraged_workers
from source
