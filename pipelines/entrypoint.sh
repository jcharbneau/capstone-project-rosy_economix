#!/usr/bin/env bash

# Initialize the Airflow database
airflow db init

# Start the scheduler in the background
airflow scheduler &

# Start the web server
exec airflow webserver