-- models/staging/stg_exchange_rate_usd_to_eur.sql

{{ config(
    materialized='view'
) }}

select
    date,
    value as exchange_rate
from {{ ref('raw_exchange_rate_usd_to_eur') }}