import logging
from airflow import DAG
from airflow.utils.dates import datetime, timedelta
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.hooks.base import BaseHook
from airflow.operators.empty import EmptyOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.trino.hooks.trino import TrinoHook

default_args = {
    "owner": "Julie Scherer",
    "retries": 2,
    "retry_delay": timedelta(seconds=10),
    "execution_timeout": timedelta(hours=1),
}

with DAG(
        "test_airflow_connections",
        start_date=datetime(2024, 4, 19),
        schedule_interval="@daily",
        catchup=False,
        default_args=default_args,
        tags=[
            "check", "secrets manager", "airflow connections",
            "airflow variables"
        ],
) as dag:

    def test_trino_connection():
        trino_conn = BaseHook.get_connection("trino_conn")
        print(trino_conn.get_uri())
        trino_hook = TrinoHook(trino_conn_id=trino_conn)
        result = trino_hook.get_records("SELECT 1")
        print(result[0])
        assert result != [1], "Trino connection test failed"

    def aws_get_bucket():
        aws_conn_id = "aws_dataexpert_conn"
        s3_bucket = Variable.get("AWS_S3_BUCKET_TABULAR")
        logging.info(f's3_bucket: {s3_bucket}')
        aws_hook = S3Hook(aws_conn_id=aws_conn_id)
        s3_bucket_result = aws_hook.get_bucket(s3_bucket)
        assert s3_bucket_result is not None, "AWS S3 connection test failed"

    def aws_load_file():
        aws_conn_id = "aws_dataexpert_conn"
        s3_bucket = Variable.get("AWS_S3_BUCKET_TABULAR")
        logging.info(f's3_bucket: {s3_bucket}')
        aws_hook = S3Hook(aws_conn_id=aws_conn_id)

        try:
            s3_key = 'test.txt'
            test_file_path = f'include/{s3_key}'
            open(test_file_path, 'w')
            aws_hook.load_file(filename=test_file_path,
                               key=s3_key,
                               bucket_name=s3_bucket,
                               replace=True)
            print(
                f"File {test_file_path} successfully uploaded to {s3_bucket}/{s3_key}"
            )

        except Exception as e:
            raise AssertionError(f"AWS S3 connection test failed: {str(e)}")

    # Task to test AWS S3 connection
    test_get_bucket_task = PythonOperator(task_id="aws_get_bucket",
                                   python_callable=aws_get_bucket)
    # Task to test AWS S3 connection
    test_aws_load_file_task = PythonOperator(task_id="aws_load_file",
                                   python_callable=aws_load_file)

    # Task to test Trino connection
    test_trino_task = PythonOperator(task_id="test_trino_connection",
                                     python_callable=test_trino_connection)

    start = EmptyOperator(task_id="start")
    end = EmptyOperator(task_id="end", trigger_rule="none_failed")

    # Task dependencies
    (start >> [test_trino_task, test_get_bucket_task, test_aws_load_file_task] >> end)
