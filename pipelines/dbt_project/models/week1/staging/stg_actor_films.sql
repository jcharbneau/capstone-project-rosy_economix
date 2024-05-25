{{ config(
    materialized='ephemeral'
) }}

select *
from {{ source('week1', 'actor_films') }}