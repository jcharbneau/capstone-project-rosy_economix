#!/bin/bash

# Function to display a twiddle while a command is running
twiddle() {
  local pid=$!
  local delay=0.1
  local spinstr='|/-\'
  echo " "
  while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
    local temp=${spinstr#?}
    printf " [%c]  " "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\b\b\b\b\b\b"
  done
  echo "    "
}

# Run a command and display status
run_command() {
  local command=$1
  local message=$2
  echo "$message... "
  $command > /dev/null 2>&1 &
  twiddle
  echo "complete"
}

# Check if dbt is installed
if ! command -v dbt &> /dev/null; then
  echo "dbt could not be found. Please install dbt by following these instructions:"
  echo "1. Install pip if you don't have it: https://pip.pypa.io/en/stable/installation/"
  echo "2. Install dbt with pip: pip install dbt"
  echo "3. Verify the installation: dbt --version"
  exit 1
fi

# Start the initialization process
echo "Starting data initialization process..."

# run the command to create the database inside of astro postgres
run_command "scripts/create_db.sh" "Creating the PostgreSQL 'pipelines' database"

# Run the stock data script
run_command "python3 scripts/get_stock_data_last_35years.py" "Downloading stock data for the last 35 years"

# Run the FRED data script
run_command "python3 scripts/download_fred_data.py" "Downloading FRED economic data"

echo "Data initialization process complete."

echo "Beginning data import"

run_command "dbt seed" "Importing raw data (seed)"
run_command "dbt run" "Processing data and generating models"

echo "Data import complete"