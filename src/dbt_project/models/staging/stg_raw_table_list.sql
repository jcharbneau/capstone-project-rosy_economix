-- models/staging/stg_raw_list.sql

select
    table_name
from
    information_schema.tables
where
    table_name ilike 'raw_%'
