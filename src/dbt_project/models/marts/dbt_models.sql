-- models/dbt_models.sql

select
    table_name as name,
    dependency
from
    {{ ref('int_combined_dbt_tables') }}
