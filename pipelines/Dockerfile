# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set environment variables
ENV AIRFLOW_HOME=/usr/local/airflow
ENV PYTHONUNBUFFERED 1

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    apt-utils \
    build-essential \
    default-libmysqlclient-dev \
    libsasl2-dev \
    libssl-dev \
    libffi-dev \
    libkrb5-dev \
    libpq-dev \
    curl \
    gnupg \
    # Clean up
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Airflow and dbt
RUN pip install --upgrade pip
RUN pip install apache-airflow[postgres,google,amazon]==2.6.1 \
    && pip install dbt-core dbt-postgres dbt-snowflake dbt-bigquery

# Create Airflow user
RUN useradd -ms /bin/bash airflow

# Set the working directory
WORKDIR $AIRFLOW_HOME

# Copy Airflow configuration file
COPY airflow.cfg $AIRFLOW_HOME/airflow.cfg

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy the dbt project
COPY dbt_project /usr/local/dbt_project

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Expose the port Airflow web server is running on
EXPOSE 8080

# Start Airflow
CMD ["webserver"]