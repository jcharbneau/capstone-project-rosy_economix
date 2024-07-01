-- models/staging/stg_marginally_attached_workers.sql

with source as (
    select * from {{ ref('raw_marginally_attached_workers') }}
)

select
    date,
    value as marginally_attached_workers
from source
