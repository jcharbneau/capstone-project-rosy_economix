from airflow import DAG
from airflow.utils.dates import datetime, timedelta
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.hooks.base import BaseHook
from airflow.operators.empty import EmptyOperator

default_args = {
    "owner": "Julie Scherer",
    "retries": 2,
    "retry_delay": timedelta(seconds=10),
    "execution_timeout": timedelta(hours=1),
}

with DAG(
    "test_secrets_backend",
    start_date=datetime(2024, 4, 19),
    schedule_interval="@daily",
    catchup=False,
    default_args=default_args,
    tags=["check", "secrets manager", "airflow connections", "airflow variables"],
) as dag:

    def get_conn(**kwargs):
        conn = BaseHook.get_connection(kwargs["my_conn_id"])
        print(
            f"Password: {conn.password}, Login: {conn.login}, URI: {conn.get_uri()}, Host: {conn.host}"
        )

    def get_var(**kwargs):
        print(f"{kwargs['var_name']}: {Variable.get(kwargs['var_name'])}")

    aws_conn_test = PythonOperator(
        task_id="aws_conn_test",
        python_callable=get_conn,
        op_kwargs={"my_conn_id": "aws_dataexpert_conn"},
    )
    trino_conn_test = PythonOperator(
        task_id="trino_conn_test",
        python_callable=get_conn,
        op_kwargs={"my_conn_id": "trino_conn"},
    )
    
    s3_bucket_var_test = PythonOperator(
        task_id="s3_bucket_var_test",
        python_callable=get_var,
        op_kwargs={"var_name": "AWS_S3_BUCKET_TABULAR"},
    )
    aws_glue_region_var_test = PythonOperator(
        task_id="aws_glue_region_var_test",
        python_callable=get_var,
        op_kwargs={"var_name": "AWS_GLUE_REGION"},
    )
    tabular_cred_var_test = PythonOperator(
        task_id="tabular_cred_var_test",
        python_callable=get_var,
        op_kwargs={"var_name": "TABULAR_CREDENTIAL"},
    )
    catalog_name_var_test = PythonOperator(
        task_id="catalog_name_var_test",
        python_callable=get_var,
        op_kwargs={"var_name": "CATALOG_NAME"},
    )
    
    start = EmptyOperator(task_id="start")
    end = EmptyOperator(task_id="end", trigger_rule="none_failed")

    # Task dependencies
    (start >> [ 
      aws_conn_test, 
      trino_conn_test, 
      s3_bucket_var_test, 
      aws_glue_region_var_test, 
      tabular_cred_var_test, 
      catalog_name_var_test,
    ] >> end)
