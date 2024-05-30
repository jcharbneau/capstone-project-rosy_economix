{% macro create_schema_if_not_exists(schema_name) %}
  {% set create_schema_sql %}
    create schema if not exists {{ target.schema }}
  {% endset %}
  {% do run_query(create_schema_sql) %}
{% endmacro %}