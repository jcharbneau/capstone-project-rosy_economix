import psycopg2
import logging
import os
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
# from airflow.operators.dagrun_operator import TriggerDagRunOperator
from datetime import datetime, timedelta


AIRFLOW_HOME = os.environ['AIRFLOW_HOME']
PATH_TO_DBT_PROJECT = f'{AIRFLOW_HOME}/dbt_project'
PATH_TO_DBT_VENV = f'{AIRFLOW_HOME}/dbt_project/.venv/bin/activate'
PATH_TO_DBT_VARS = f'{AIRFLOW_HOME}/dbt_project/dbt.env'
ENTRYPOINT_CMD = f"source {PATH_TO_DBT_VENV} && source {PATH_TO_DBT_VARS}"

default_args = {
    'owner': 'airflow',
    'depends_on_past': True,
    'start_date': datetime(2024, 5, 30),  # Ensure this is set correctly
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_stock_data_update',
    default_args=default_args,
    description='DAG to update stock data daily',
    schedule_interval=timedelta(days=1),
    catchup=False  # Prevent backfilling of past dates
)


def create_db_connection():
    try:
        conn = psycopg2.connect(
            dbname="pipelines",
            user="postgres",
            password="postgres",
            host="postgres",
            port="5432"
        )
        return conn
    except Exception as e:
        raise ValueError(f"Error connecting to database: {e}")


def get_last_data_date():
    conn = create_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT MAX("Date") FROM raw_stock_data')
    last_date = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    if last_date:
        logging.info(f"Last date retrieved from raw_stock_data: {last_date}")
    else:
        logging.info("No data found in raw_stock_data. Using default start date.")

    return last_date


def fetch_new_stock_data(**kwargs):
    last_date = kwargs['ti'].xcom_pull(task_ids='get_last_data_date')

    if last_date is None:
        last_date = datetime(2024, 1, 1)  # Default start date if no data is available
    elif isinstance(last_date, str):
        last_date = datetime.strptime(last_date, "%Y-%m-%d")
    elif isinstance(last_date, datetime):
        last_date = last_date
    else:
        last_date = datetime.combine(last_date, datetime.min.time())

    start_date = last_date + timedelta(days=1)
    end_date = datetime.today()

    logging.info(f"Fetching data from {start_date} to {end_date}")

    # Replace with your data fetching logic
    # data = fetch_data_from_api(start_date, end_date)
    data = []  # Placeholder for fetched data
    return data


def insert_incremental_data(**kwargs):
    data = kwargs['ti'].xcom_pull(task_ids='fetch_new_stock_data')
    conn = create_db_connection()
    cursor = conn.cursor()
    insert_query = "INSERT INTO incremental_stock_data (columns) VALUES %s"
    cursor.executemany(insert_query, data)
    conn.commit()
    cursor.close()
    conn.close()


start = DummyOperator(task_id='start', dag=dag)

get_last_data_date = PythonOperator(
    task_id='get_last_data_date',
    python_callable=get_last_data_date,
    dag=dag,
)

fetch_new_stock_data = PythonOperator(
    task_id='fetch_new_stock_data',
    python_callable=fetch_new_stock_data,
    provide_context=True,
    dag=dag,
)

insert_incremental_data = PythonOperator(
    task_id='insert_incremental_data',
    python_callable=insert_incremental_data,
    provide_context=True,
    dag=dag,
)

trigger_dbt = DummyOperator(
    task_id='trigger_dbt',
    dag=dag
)
# trigger_dbt = TriggerDagRunOperator(
#     task_id='trigger_dbt',
#     trigger_dag_id='dbt_run',
#     dag=dag,
# )

start >> get_last_data_date >> fetch_new_stock_data >> insert_incremental_data >> trigger_dbt