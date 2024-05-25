**Airflow + dbt**
====================

This repository emulates an “open-source” project, though exclusively shared within the dataexpert community. Members can access the repository for independent use or contribute enhancements to the project's design and functionality. This serves as an opportunity to practice contributing to publicly shared open-source repositories.

**Table of Contents**

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
    - [Debugging](#debugging)
  - [dbt Project Setup](#dbt-project-setup)
- [Homework Submission](#homework-submission)
- [dbt airflow Assignment](#dbt-airflow-assignment)


# **🚀 Getting Started**

## **Prerequisites**

1. **Install [Docker](https://docs.docker.com/engine/install/)**: Docker is a platform for packaging, distributing, and managing applications in containers.
2. **Install the [Astro CLI](https://docs.astronomer.io/astro/cli/install-cli)**: Astro CLI is a command-line tool designed for working with Apache Airflow projects, streamlining project creation, deployment, and management for smoother development and deployment workflows.

## **Local Development**

1. **Clone the Repository**: Open a terminal, navigate to your desired directory, and clone the repository using:
    ```bash
    git clone git@github.com:DataExpert-io/airflow-dbt-project.git # clone the repo
    cd airflow-dbt-project # navigate into the new folder
    ```
    
    1. If you don’t have SSH configured with the GitHu CLI, please follow the instructions for [generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account?tool=cli) in the GitHub docs.
2. **Docker Setup and Management**: Launch Docker Daemon or open the Docker Desktop app
3. **Run the Astro Project**:
    - Start Airflow on your local machine by running **`astro dev start`**
        - This will spin up 4 Docker containers on your machine, each for a different Airflow component:
            - **Postgres**: Airflow's Metadata Database, storing internal state and configurations.
            - **Webserver**: Renders the Airflow UI.
            - **Scheduler**: Monitors, triggers, and orchestrates task execution for proper sequencing and resource allocation.
            - **Triggerer**: Triggers deferred tasks.
        - Verify container creation with **`docker ps`**
    - **Access the Airflow UI**: Go to http://localhost:8081/ and log in with '**`admin`**' for both Username and Password
        >
        > ℹ️ Note: Running astro dev start exposes the Airflow Webserver at port **`8081`** and Postgres at port **`5431`**.
        >
        > If these ports are in use, halt existing Docker containers or modify port configurations in **`.astro/config.yaml`**.
        > 
4. **Stop** the Astro Docker container by running `**astro dev stop**`
    >
    > ❗🚫❗  Remember to stop the Astro project after working to prevent issues with Astro and Docker ❗🚫❗
    >
    

**⭐️ TL;DR - Astro CLI Cheatsheet ⭐️** 

```bash
astro dev start # Start airflow
astro dev stop # Stop airflow
astro dev restart # Restart the running Docker container
astro dev kill # Remove all astro docker components
```

### **Debugging**

If the Airflow UI isn't updating, the project seems slow, Docker behaves unexpectedly, or other issues arise, first remove Astro containers and rebuild the project:

- Run these commands:
    ```bash
    # Stop all locally running Airflow containers
    astro dev stop
    
    # Kill all locally running Airflow containers
    astro dev kill
    
    # Remove Docker container, image, and volumes
    docker ps -a | grep dataexpert-airflow-dbt | awk '{print $1}' | xargs -I {} docker rm {}
    docker images | grep ^dataexpert-airflow-dbt | awk '{print $1}' | xargs -I {} docker rmi {}
    docker volume ls | grep dataexpert-airflow-dbt | awk '{print $2}' | xargs -I {} docker volume rm {}
    
    # In extreme cases, clear everything in Docker
    docker system prune
    ```
    
- Restart Docker Desktop.
- (Re)build the container image without cache.
    ```bash
    astro dev start --no-cache
    ```
    

## dbt Project Setup

- Go to the project's directory
  ```bash
  cd dbt_project
  ```
- Create a venv to isolate required packages
  ```bash
  python3 -m venv venv # MacOS/Linux
  # or 
  python -m venv venv # Windows/PC
  ```
- Source the virtual environment
  ```bash
  source venv/bin/activate # MacOS/Linux
  # or
  venv/Scripts/activate # Windows/PC
  ```
- Install the required packages
  ```bash
  pip3 install -r dbt-requirements.txt # MacOS/Linux
  # or 
  pip install -r dbt-requirements.txt # Windows/PC
  ```
- Update `DBT_SCHEMA` environment variable
  - MacOS/Linux:
    - Open the `dbt.env` file, change the `DBT_SCHEMA` to your schema from Weeks 1 and 2, and source the environment variables to your local (terminal) environment
      ```bash
      export DBT_SCHEMA='your_trino_schema' # EDIT THIS FIELD
      ```
    - then run
      ```bash
      source dbt.env
      ```
  - Windows/PC:
    - Instead of overwriting the DBT_SCHEMA in the file you can run:
      ```bash
      set DBT_SCHEMA=your_schema

      # For example
      set DBT_SCHEMA=bruno #(without quotes)
      ```


- Run `dbt debug` to check your connection. You should see a message like this:
    ```
    21:43:08  Running with dbt=1.8.0
    21:43:08  dbt version: 1.8.0
    21:43:08  python version: 3.9.6
    21:43:08  python path: <path_to_repo>/airflow-dbt-project/dbt_project/venv/bin/python3
    21:43:08  os info: macOS-13.5.1-arm64-arm-64bit
    21:43:08  Using profiles dir at ./
    21:43:08  Using profiles.yml file at ./profiles.yml
    21:43:08  Using dbt_project.yml file at ./dbt_project.yml
    21:43:08  adapter type: trino
    21:43:08  adapter version: 1.8.0
    21:43:08  Configuration:
    21:43:08  profiles.yml file [OK found and valid]
    21:43:08  dbt_project.yml file [OK found and valid]
    21:43:08  Required dependencies:
    21:43:08   - git [OK found]
    
    21:43:08  Connection:
    21:43:08  host: dataengineer-eczachly.trino.galaxy.starburst.io
    21:43:08  port: 8443
    21:43:08  user: support@eczachly.com/student
    21:43:08  database: academy
    21:43:08  schema: <your schema>
    21:43:08  cert: None
    21:43:08  prepared_statements_enabled: True
    21:43:08  Registered adapter: trino=1.8.0
    21:43:10  Connection test: [OK connection ok]
    
    21:43:10  All checks passed!
    ```
    

You're good to go!

# **Homework Submission**

1. **Create a Branch:**
    - Navigate to the **`airflow-dbt-project`** folder on your local machine.
    - Use the **`git checkout -b`** command to create a new branch where you can commit and push your changes.
        - Use **`homework/**`** to denote homework-related branches.
        - Prefix your branch name with your Git username to avoid conflicts.
        
        For example:
        
        ```bash
        git checkout -b homework/my-git-username-dbt-dag
        ```
        
2. **Set up your project folders:**
    - Create a new folder in **`dags/community/<git_username>`**. Replace **`<git_username>`** with your actual GitHub username.
    - This is where you will create your custom DAG.
    - Add any non-DAG related files to **`include/community/<git_username>`** (again, replace **`<git_username>`** with your actual GitHub username).
3. **Pick your assignment**:
    - Option 1: We’ve provided specific guidelines for developing a DAG with dbt. See below for the assignment instructions.
    - Option 2: Or, if you’d like a bit more freedom, you can write your own custom DAG that incorporates a Write-Audit-Publish (WAP) framework. You can use the dbt DAG or spark/glue DAG examples from class to develop your DAG.
4. **Develop your DAG locally:**
    - The name of your DAG should start with your GitHub username, just like the branch, to differentiate it from other students’ DAGs and avoid conflicts. For example:
        
        ```python
        @dag()
        def your_github_username_dbt_dag():
        	pass
        
        your_github_username_dbt_dag()
        ```
        
    - It's crucial to thoroughly build and test your DAGs locally before opening a PR.
        
        > ‼️ When you open a PR with changes to the **`dags/**`** folder, this action will trigger  an automatic GitHub workflow to parse your DAG and deploy the changes to the Astronomer Cloud, assuming there are no DAG parse errors. This is where the TAs will be able to find and test your DAGs when grading. If your PR includes changes that aren't in other people's work and your branch is different from the **`main`** one, your updates could replace or overwrite other people's work. ‼️
        > 
    - Please also make sure your branch is up to date with **`main`** before pushing to the remote branch.
        
        ```bash
        git pull origin main --rebase
        ```
        
    - We’ve set up connections and variables for you to use in your DAGs, which you can find in **`dags/checks`**. To test that you have access to these variables and connections on your local machine, go to the Airflow UI on localhost and trigger the DAGs. Once confirmed, you can proceed to fully test and develop your DAG locally.
    - Tip: you can use the **`.airflowignore`** file to tell Airflow to ignore certain DAG folders. This helps your computer run Airflow smoothly without using too much memory or power.
5. After you’ve confirmed all the tasks in your DAG run successfully on localhost, open a PR in the [airflow-dbt-project](https://github.com/DataExpert-io/airflow-dbt-project) folder to submit the homework DAG.
6. Add a screenshot of the DAG run showing all the tasks ran successfully and add to the description in your PR.

# dbt airflow Assignment

For this week's assignment we will create a WAP pipeline update the Northwind's fact orders table.

Remember that, if you are running your project for the first time, dbt will ask you to run

```bash
$ dbt deps
```

to install the packages defined in packages.yml

## Steps

### Adding new sources

Add the tables

- `bootcamp.nw_orders`
- `bootcamp.nw_order_details`
to the `_sources.yml` file in the `models/staging` folder. (more info about sources here https://docs.getdbt.com/docs/build/sources)

### Create base models

Create a base model for each source (In dbt we call them staging models). Create a model called `stg_nw_orders` and `stg_new_order_details`.

These models should pull data from the sources. (use the `{{ source() }}` function we saw in the lab and lecture), and it should select all columns.

You can use the `codegen` function we saw in the lab to generate the base models (https://github.com/dbt-labs/dbt-codegen/tree/0.12.1/#create_base_models-source). Just change the name of the file later.

(Optional) You can create the `stg_nw_orders.yml` and `stg_nw_order_details` files to include documentation and tests. (See the `.yml` file here h[ttps://docs.getdbt.com/reference/model-properties](https://docs.getdbt.com/reference/model-properties))

### Create the audit table

Create a model called `audit_nw_fact_orders`.

This model should select from the base models you created, but only for a specific date. You can use `'1998-04-30'` for this assignment. In a real application, we would probably set it as `current_date`.

You will notice `stg_nw_order_details` does not have a date column. So you should select the rows where the `orderid` matches the `orderid` of your selection from `stg_nw_orders`.

This model should have the following columns

- `orderid`
- `customerid`
- `employeeid`
- `orderdate`
- `total_amount` (`unit_price` * `quantity` - `discount`. Notice that an order can contain more than one product. So, sum the values for all products in the order)

Create an `audit_nw_fact_orders.yml` file to add documentation and tests.

You should add at least one `unique` and `not_null` test for the column `orderid`.
(see more about tests here https://docs.getdbt.com/docs/build/data-tests), and a `singular test` that checks if the `total_amount` column has positive values (https://docs.getdbt.com/docs/build/data-tests#singular-data-tests).

### Create the production table

Create a `nw_fact_orders` model to be our production table. This model should select from the audit model.

This model should be an incremental model (see more about incremental models in dbt-trino here https://docs.getdbt.com/reference/resource-configs/trino-configs#incremental), you can use any incremental strategy you want.

### Create the WAP pipeline with airflow

To create an airflow job, you can create a copy of the `dbt_dag.py` file (inside `dags/dbt/`) and name it `dbt_homework_dag.py`.

Change the dag's name to `dbt_homework_dag`

You should have the following tasks:

- A task that runs `dbt deps` to install dbt packages
- A task to run `stg_nw_orders` and `stg_nw_order_details` (you can make two separate tasks, or one task that runs both models)
- A write task, that runs `audit_nw_fact_orders`
- An audit task, that tests `audit_nw_fact_orders`
- A publish task, that runs `nw_fact_orders`

<br>
<hr />

# Other helpful resources for learning!

### :whale: Working with Docker

> :bulb: Understanding Docker Images and Containers:
> 
> 
> Docker provides lightweight and isolated environments for consistent application execution across different systems. Containers encapsulate an application's code, libraries, and dependencies into a portable unit, ensuring reproducible environments. Docker images capture snapshots of filesystems, while containers represent running instances of those images.
> 
> In simple terms, you can think of Docker as a tool that creates special "boxes" for software. These boxes include everything the software needs to run, like its instructions and tools. Docker also takes pictures of these boxes, called images, to use later. When you want to use the software, you open one of these pictures, and that creates a real working "box" called a container.
> 
> To learn more, explore Docker's official [Getting Started](https://docs.docker.com/get-started/) guide. For a comprehensive understanding, watch this informative [YouTube video](https://www.youtube.com/watch?v=pg19Z8LL06w) by TechWorld with Nana.
> 

Here are some helpful commands to remember as you get used to working with Docker:

- To check if you have any running Docker containers, use:
    ```bash
    docker ps      # List all available containers
    docker container ls   # Equivalent to above
    docker ps -a     # List running containers
    docker container ls -a   # Equivalent to above
    ```
    
- To list all Docker images locally:
    ```bash
    docker images
    ```
    
- Use the command below to remove an image. This is useful to free up space when you have unused images. Replace `<IMAGE ID>` with the actual image ID, which you can find by running **`docker images`**.
    ```bash
    docker rmi <IMAGE ID>
    ```
    
- Use the **`docker prune`** command to remove/reset Docker resources. This is especially handy to clean up resources and reclaim disk space.
    ```bash
    docker images prune
    docker container prune
    docker volume prune
    docker system prune
    ```
    
- To learn more about Docker, check out these resources below:
    - [Docker Overview](https://docs.docker.com/get-started/)
    - Enhance your Docker knowledge with this enlightening [YouTube Tutorial](https://www.youtube.com/watch?v=pg19Z8LL06w) by TechWorld with Nana

### 📂 Navigating the Repository

> :bulb: Learn more about the features of an Astro project here!
> 

Each Astro project contains various directories and files. Learn more about the structure of our Astro project below:

- **`dags`**: This directory houses Directed Acyclic Graphs (DAGs), which represent the workflows in Apache Airflow. Note: it's highly encouraged that you create DAGs in subfolders so that you can make use of the `.airflowignore` file when testing locally. Learn more below:
    - **`community/`**: Stores default example DAGs for training and local testing.
    - **`.airflowignore`**: Use this file to exclude folders from the Airflow scheduler, handy for local testing and avoiding production changes.
- **`dbt_project`**: Here lies the dbt project, accessible both locally for testing and development, and within Airflow to be used in our DAGs.
- **`Dockerfile`**: This file is based on the Astro Docker image and can be customized to include project-specific commands and/or overrides for runtime behavior. Understanding this file is optional but you're welcome to explore if you wish to dive deeper into Astro.
- **`include`** contains additional project files:
- **`requirements.txt`**: Install Python packages needed for your project by adding them to this file.
- **`airflow_settings.yaml`**: Use this local-only file to define Airflow Connections, Variables, and Pools. This allows you to manage these configurations locally instead of via the Airflow UI during DAG development.
