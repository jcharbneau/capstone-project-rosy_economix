import os
import logging
from airflow.decorators import dag, task
from datetime import datetime
from airflow.hooks.base import BaseHook
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.operators.python_operator import PythonOperator
from airflow.models import Variable
from include.eczachly.glue_job_submission import create_glue_job

s3_bucket = Variable.get("AWS_S3_BUCKET_TABULAR")
tabular_credential = Variable.get("TABULAR_CREDENTIAL")
catalog_name = Variable.get("CATALOG_NAME")  # "eczachly-academy-warehouse"
aws_region = Variable.get("AWS_GLUE_REGION")  # "us-west-2"
aws_access_key_id = Variable.get("DATAEXPERT_AWS_ACCESS_KEY_ID")
aws_secret_access_key = Variable.get("DATAEXPERT_AWS_SECRET_ACCESS_KEY")
s3_key = "jlcharbneau/scripts/cumulative_job_example.py"


@dag("cumulative_job_example",
     description="An example PySpark DAG",
     default_args={
         "owner": "Zachary Wilson",
         "start_date": datetime(2024, 5, 1),
         "retries": 1,
     },
     max_active_runs=1,
     schedule_interval="@yearly",
     catchup=False,
     tags=["pyspark", "glue", "example", "eczachly"],
     template_searchpath='include/eczachly')
def cumulative_dag():
    default_output_table = "jlcharbneau.nba_players"
    @task
    def upload_script_to_s3():
        aws_conn_id = "aws_dataexpert_conn"
        s3_hook = S3Hook(aws_conn_id=aws_conn_id)
        local_script_path = os.path.join("include", s3_key)

        s3_hook.load_file(
            filename=local_script_path,
            key=s3_key,
            bucket_name=s3_bucket,
            replace=True,
        )
        logging.info(
            f"File {local_script_path} successfully uploaded to s3://{s3_bucket}/{s3_key}"
        )

    run_job = PythonOperator(
        task_id="run_glue_job",
        depends_on_past=True,
        python_callable=create_glue_job,
        op_kwargs={
            "job_name": "cumulative_nba_players",
            "script_path": f"s3://{s3_bucket}/{s3_key}",
            "aws_access_key_id": aws_access_key_id,
            "aws_secret_access_key": aws_secret_access_key,
            "tabular_credential": tabular_credential,
            "s3_bucket": s3_bucket,
            "catalog_name": catalog_name,
            "aws_region": aws_region,
            "description": "Testing Job Spark",
            "arguments": {
                "--ds": "{{ ds }}",
                "--output_table": default_output_table
            },
        },
    )

    upload_script_to_s3() >> run_job


cumulative_dag()
