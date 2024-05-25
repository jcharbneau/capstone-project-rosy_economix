from airflow.decorators import dag, task
from airflow.operators.empty import EmptyOperator
from datetime import datetime


# Define DAG using @dag decorator
@dag(
    "jcharbneau_dag",
    description="A simple DAG",
    default_args={
        "owner": "Jess Charbneau",
        "start_date": datetime(2024, 5, 1),
        "retries": 1,
    },
    schedule_interval="@once",
    catchup=False,
    tags=["community"],
)
def jcharbneau_dag():
    '''### docstring'''
    start = EmptyOperator(task_id="start", trigger_rule="all_done")

    # Define tasks
    task1 = EmptyOperator(task_id="task_1")
    task2 = EmptyOperator(task_id="task_2", trigger_rule="all_success")
    task3 = EmptyOperator(task_id="task_3", trigger_rule="all_success")
    task4 = EmptyOperator(task_id="task_4", trigger_rule="none_failed")

    # Other types of tasks
    @task
    def example_python():
        pass

    end = EmptyOperator(task_id="end", trigger_rule="all_done")

    # Define task dependencies
    start >> task1
    task1 >> [task2, task3] >> task4 >> end


# Instantiate the DAG
jcharbneau_dag()