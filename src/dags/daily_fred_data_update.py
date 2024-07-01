from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
from airflow.hooks.postgres_hook import PostgresHook
from airflow.models import Variable
from datetime import datetime, timedelta
import pandas as pd
import requests
import logging
import os

# Default arguments for the DAG
default_args = {
    'owner': 'airflow',
    'depends_on_past': True,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Set up the DAG
dag = DAG(
    'fred_data_pipeline',
    default_args=default_args,
    description='A simple data pipeline for fetching FRED data and running dbt',
    schedule_interval=timedelta(days=1),
    start_date=datetime(2024, 6, 24),
    catchup=False,
)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# FRED API key from Airflow variable
api_key = Variable.get("FRED_API_KEY")
if not api_key:
    raise ValueError("Please set the FRED_API_KEY Airflow variable")

# List of FRED series IDs for economic indicators with their frequencies
indicators = {
    'S_and_P 500 Index': {'series_id': 'SP500', 'frequency': 'daily'},
    'GDP': {'series_id': 'GDP', 'frequency': 'quarterly'},
    'Unemployment Rate': {'series_id': 'UNRATE', 'frequency': 'monthly'},
    'CPI': {'series_id': 'CPIAUCSL', 'frequency': 'monthly'},
    'Nonfarm Payrolls': {'series_id': 'PAYEMS', 'frequency': 'monthly'},
    'Job Openings': {'series_id': 'JTSJOL', 'frequency': 'monthly'},
    'Average Hourly Earnings': {'series_id': 'AHETPI', 'frequency': 'monthly'},
    'Total Wages and Salaries': {'series_id': 'BA06RC1A027NBEA', 'frequency': 'annual'},
    'Employment Cost Index': {'series_id': 'ECIWAG', 'frequency': 'quarterly'},
    'Average Weekly Earnings': {'series_id': 'CES0500000011', 'frequency': 'monthly'},
    'Consumer Spending': {'series_id': 'PCEC', 'frequency': 'monthly'},
    'Labor Force Participation Rate': {'series_id': 'CIVPART', 'frequency': 'monthly'},
    'Discouraged Workers': {'series_id': 'LNU05026645', 'frequency': 'monthly'},
    'Marginally Attached Workers': {'series_id': 'LNU05026645', 'frequency': 'monthly'},
    'Underemployment Rate': {'series_id': 'U6RATE', 'frequency': 'monthly'},
    'Consumer Sentiment Index': {'series_id': 'UMCSENT', 'frequency': 'monthly'},
    'Daily Treasury Yield Curve Rates': {'series_id': 'DGS1', 'frequency': 'daily'},
    'New Private Housing Units Authorized by Building Permits': {'series_id': 'PERMIT', 'frequency': 'monthly'},
    '10-Year Treasury Constant Maturity Rate': {'series_id': 'DGS10', 'frequency': 'daily'},
    'Exchange Rate USD to EUR': {'series_id': 'DEXUSEU', 'frequency': 'daily'},
    'Federal Funds Effective Rate': {'series_id': 'FEDFUNDS', 'frequency': 'daily'}
}


# # Determine the directory one level up from where this DAG is located
# dag_directory = os.path.dirname(os.path.abspath(__file__))
# project_directory = os.path.abspath(os.path.join(dag_directory, os.pardir))

AIRFLOW_HOME = os.environ['AIRFLOW_HOME']
PATH_TO_DBT_PROJECT = f'{AIRFLOW_HOME}/dbt_project'
PATH_TO_DBT_VENV = f'{AIRFLOW_HOME}/dbt_venv/bin/activate'
PATH_TO_DBT_VARS = f'{AIRFLOW_HOME}/dbt_project/dbt.env'
ENTRYPOINT_CMD = f"source {PATH_TO_DBT_VENV} && source {PATH_TO_DBT_VARS}"


def fetch_fred_data(**kwargs):
    series_id = kwargs['series_id']
    frequency = kwargs['frequency']
    execution_date = kwargs['execution_date']

    # Convert execution_date to datetime if it is not already
    if isinstance(execution_date, str):
        execution_date = datetime.strptime(execution_date, '%Y-%m-%d')
    elif not isinstance(execution_date, datetime):
        execution_date = pd.to_datetime(execution_date)
    else:
        # Explicit conversion from Proxy to datetime
        execution_date_str = execution_date.strftime('%Y-%m-%d')
        execution_date = datetime.strptime(execution_date_str, '%Y-%m-%d')

    execution_date_str = execution_date.strftime('%Y-%m-%d')

    url = (
        f'https://api.stlouisfed.org/fred/series/observations'
        f'?series_id={series_id}&api_key={api_key}&file_type=json'
    )

    logging.info(
        "Fetching data for series %s from FRED for date %s from %s",
        series_id, execution_date_str, url
    )

    response = requests.get(url)
    logging.info("response status code: %d", response.status_code)

    if response.status_code != 200:
        logging.error(
            "Failed to fetch data for series %s. Status code: %d",
            series_id, response.status_code
        )
        return pd.DataFrame()

    data = response.json()
    logging.info("data received from FRED API: %s", data)

    if 'observations' not in data:
        logging.error(
            "No 'observations' found for series %s. Response: %s",
            series_id, data
        )
        return pd.DataFrame()

    df = pd.DataFrame(data['observations'])
    df['value'] = pd.to_numeric(df['value'], errors='coerce')  # Convert to numeric, coerce errors to NaN
    df['date'] = pd.to_datetime(df['date'])
    logging.info("Fetched %d rows for series %s.", len(df), series_id)

    logging.info(f"Types in dataframe: {df.dtypes}")
    logging.info(f"Type of execution_date: {type(execution_date)}")

    # Ensure execution_date is a datetime object and use it for comparison
    logging.info(f"DataFrame dates: {df['date'].tail()}")
    logging.info(f"Execution date: {execution_date}")

    start_date, end_date = get_date_range(execution_date, frequency)
    logging.info(f"Date range for filtering: {start_date} to {end_date}")

    # Convert start_date and end_date to datetime to match df['date'] type
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    logging.info(f"Filtered start_date: {start_date}, end_date: {end_date}")

    # Filter data based on the frequency
    df = df[(df['date'] >= start_date) & (df['date'] < end_date)]
    logging.info("Final dataframe:\n%s", df)

    return df[['date', 'value']]


def get_date_range(execution_date, frequency):
    if frequency == 'quarterly':
        start_date = execution_date - pd.offsets.QuarterBegin(startingMonth=1)
        end_date = start_date + pd.offsets.QuarterEnd()
    elif frequency == 'monthly':
        start_date = execution_date - pd.offsets.MonthBegin()
        end_date = start_date + pd.offsets.MonthEnd()
    elif frequency == 'weekly':
        start_date = execution_date - timedelta(days=execution_date.weekday())
        end_date = start_date + timedelta(days(6))
    elif frequency == 'annually':
        start_date = execution_date - pd.offsets.YearBegin()
        end_date = start_date + pd.offsets.YearEnd()
    elif frequency == 'daily':
        start_date = execution_date
        end_date = execution_date + timedelta(days=1)
    else:
        start_date = execution_date
        end_date = execution_date + timedelta(days=1)
    return start_date, end_date


def write_data_to_postgres(data, table_name):
    if data.empty:
        logging.error(f"No data to write to table {table_name}.")
        return

    postgres_hook = PostgresHook(postgres_conn_id='postgres')
    engine = postgres_hook.get_sqlalchemy_engine()
    data.to_sql(table_name, engine, if_exists='replace', index=False)
    logging.info(f"Data written to PostgreSQL table {table_name}")

def fetch_and_save_fred_data(**kwargs):
    series_id = kwargs['series_id']
    series_name = kwargs['series_name']
    frequency = kwargs['frequency']
    execution_date = kwargs['execution_date']

    # Convert execution_date to datetime if it is not already
    if isinstance(execution_date, str):
        execution_date = datetime.strptime(execution_date, '%Y-%m-%d')
    elif not isinstance(execution_date, datetime):
        execution_date = pd.to_datetime(execution_date)
    else:
        # Explicit conversion from Proxy to datetime
        execution_date_str = execution_date.strftime('%Y-%m-%d')
        execution_date = datetime.strptime(execution_date_str, '%Y-%m-%d')

    table_name = f"raw_{series_name.lower().replace(' ', '_')}"

    df = fetch_fred_data(series_id=series_id, frequency=frequency, execution_date=execution_date)
    logging.info(f"would have written to {table_name}")
    logging.info(df.head(20))

    if df.empty:
        logging.error(f"Skipping {series_name} due to data fetch error.")
        return
    # write_data_to_postgres(df, table_name)

# Create a task for each FRED series ID
tasks = []
for name, info in indicators.items():
    task = PythonOperator(
        task_id=f'fetch_{name.lower().replace(" ", "_")}',
        python_callable=fetch_and_save_fred_data,
        op_kwargs={'series_id': info['series_id'], 'series_name': name, 'frequency': info['frequency']},
        provide_context=True,
        dag=dag,
    )
    tasks.append(task)

# Task to check dbt dependencies
dbt_deps = BashOperator(
    task_id='dbt_deps',
    bash_command=f'{ENTRYPOINT_CMD} && cd {PATH_TO_DBT_PROJECT} && dbt deps --profiles-dir {PATH_TO_DBT_PROJECT} --project-dir {PATH_TO_DBT_PROJECT}',
    env={"PATH_TO_DBT_VENV": PATH_TO_DBT_VENV},
    cwd=PATH_TO_DBT_PROJECT,
    dag=dag
)
# --profiles-dir /usr/local/airflow/dbt_project/.dbt/
# Task to run dbt models
dbt_run = BashOperator(
    task_id='dbt_run',
    bash_command=f'{ENTRYPOINT_CMD} && cd {PATH_TO_DBT_PROJECT} && dbt run --profiles-dir {PATH_TO_DBT_PROJECT} --project-dir {PATH_TO_DBT_PROJECT}',
    env={"PATH_TO_DBT_VENV": PATH_TO_DBT_VENV},
    cwd=PATH_TO_DBT_PROJECT,
    dag=dag
)

# Setting up task dependencies
for task in tasks:
    task >> dbt_deps

dbt_deps >> dbt_run
