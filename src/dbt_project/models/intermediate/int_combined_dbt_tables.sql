with manifest as (
    select *
    from {{ ref('raw_dbt_manifest') }}
),

-- Splitting the dependencies into individual rows
dependencies as (
    select
        name,
        regexp_split_to_table(depends_on, ',') as dependency
    from
        manifest
),

-- Selecting from the raw_list staging model
raw_list as (
    select
        table_name
    from
        {{ ref('stg_raw_table_list') }}
),

-- Replacing unwanted substrings in the dependency strings
cleaned_dependencies as (
    select
        name,
        regexp_replace(dependency, 'model\.dbt_project\.|seed\.dbt_project\.', '') as dependency
    from
        dependencies
),

-- Combining all tables
all_tables as (
    select
        d.name as table_name,
        coalesce(d.dependency, 'seed') as dependency
    from
        cleaned_dependencies d
    union
    select
        r.table_name as table_name,
        'source' as dependency
    from
        raw_list r
)

-- Final select with order by
select
    table_name,
    dependency
from
    all_tables
order by
    table_name
