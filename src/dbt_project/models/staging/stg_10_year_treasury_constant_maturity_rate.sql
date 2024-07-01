-- models/staging/stg_10_year_treasury_constant_maturity_rate.sql

{{ config(
    materialized='view'
) }}

select
    date,
    value as year_treasury_rate
from {{ ref('raw_10_year_treasury_constant_maturity_rate') }}