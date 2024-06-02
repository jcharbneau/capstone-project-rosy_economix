#!/bin/bash
PGPASSWORD=postgres

# Variables
DB_NAME="pipelines"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5631"

# Check if database exists
RESULT=$(psql -U $DB_USER -h $DB_HOST -p $DB_PORT -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

# Create database if it doesn't exist
if [ "$RESULT" != "1" ]; then
  echo "Database $DB_NAME does not exist. Creating..."
  createdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME

  echo "Database $DB_NAME created."
else
  echo "Database $DB_NAME already exists."
fi
#  psql -U $DBUSER -h $DB_HOST -p $DB_PORT -d $DB_NAME -tAc "CREATE SCHEMA PUBLIC"
