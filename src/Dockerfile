FROM quay.io/astronomer/astro-runtime:11.6.0

USER root
COPY ./dbt_project ./dbt_project
COPY --chown=astro:0 . .

RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

USER astro
RUN python -m venv dbt_venv && \
    . dbt_venv/bin/activate && \
    pip install --no-cache-dir -r dbt_project/dbt-requirements.txt && \
    source dbt_project/dbt.env && \
    deactivate
