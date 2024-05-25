from airflow.decorators import dag
from airflow.operators.dummy import DummyOperator
from datetime import datetime

# Define DAG using @dag decorator
@dag(
    # The name of your DAG and the name of the Python file should match.
    # Both should start with your GitHub username to avoid duplicate DAG names.
    "<your_username>_dag",
    description="A simple DAG",
    default_args={
        "owner": "Your first and last name",
        "start_date": datetime(2024, 5, 1),
        "retries": 1,
    },
    schedule_interval="@once",
    catchup=False,
    tags=["community"],
)

def your_username_dag():
    '''
    ### docstring
    '''
    start = DummyOperator(task_id="end", trigger_rule="all_done")
    
    
    
    # Define tasks
    task1 = DummyOperator(task_id="task_1")
    task2 = DummyOperator(task_id="task_2", trigger_rule="all_success")
    task3 = DummyOperator(task_id="task_3", trigger_rule="all_success")
    task4 = DummyOperator(task_id="task_4", trigger_rule="none_failed")
    
    # Other types of tasks
    @task
    def example_python():
        pass

    end = DummyOperator(task_id="end", trigger_rule="all_done")

    # Define task dependencies
    task1 >> [task2, task3] >> task4 >> end


# Instantiate the DAG
your_username_dag()
