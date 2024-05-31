{% macro call_python_script(script_path) %}
    {{ log("Running Python script: " ~ script_path, info=True) }}
    {% set command = "python3 " ~ script_path %}
    {% set results = run_query("DO $$ BEGIN PERFORM system('" ~ command ~ "'); END $$;") %}
    {{ return(results) }}
{% endmacro %}