{% snapshot snapshot_customers %}

{{
    config(
      target_database='academy',
      target_schema=env_var('DBT_SCHEMA'),
      unique_key='id',

      strategy='timestamp',
      updated_at='last_updated_dt',
    )
}}

select * from {{ source('bootcamp', 'js_raw_customers') }}

{% endsnapshot %}