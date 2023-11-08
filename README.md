# Capstone Project

## Introduction

The purpose of the capstone project is to give students a chance to apply what they have learned throughout the boot camp program. Think of this project as an important piece that you can add to your GitHub portfolio when applying for jobs.

In this project, we will give you some ideas for problems to solve and data sets to use, but it is **heavily** encouraged for students to try and find their own data sets (perhaps create their own datasets), or come up with their own analysis. We would like to push students to not use datasets that are already well-understood, and have many articles/public projects written about them (looking at you, iris/titanic/yellow cab taxi datasets).

## Steps

To help structure the projects, students are encouraged to think of solving a series of steps:

1. Identify a problem you'd like to solve.
2. Scope the project and figure out what datasets you're using.
   - use at least 2 different sources (with at least 2 different data sources/formats; i.e. csv, APIs, json, parquet), totaling at least 1 million rows.
   - explain what use cases you are preparing the data for (is it an analytics table in a data warehouse, a relational database, a dashboard, etc.).
   - identify a tech stack/choice of tools and defend your choices.
3. Explore and assess the data.
   - identify data quality issues.
   - perform EDA to become familiar with the data if needed (look at the ranges on values, categorical values, invalid values, etc.).
   - document the steps you need to clean the data.
4. Create a diagram defining the target data model.
   - use diagramming software to create a dimensional model of what the data will look like when your ETL is finished, and how the data will be served.
5. Create a data dictionary of the fields, any constraints on them, as well as data quality or transformations that need to be incorporated.
6. Write the ETL pipelines to transform the data.
   - create the code for the data pipelines
7. Write code to check data quality for the data quality checks you specified before:
   - here are a few good tools for performing data quality checks
     - dbt tests
     - pyspark chispa
     - pyspark deequ
     - python pandas pandera
     - python soap
     - python great expectations
   - make sure to include any referential integrity constraint checks (since these usually aren't enforced in an analytical environment)
   - make sure to include sanity row count checks
8. Run the ETL pipelines and data quality checks, and include screenshots of:
   - successful runs
   - successful (or failing) data quality checks
   - whatever analytical frontend you're displaying the data through (the dashboard, the application, plots of analytics, etc.)

## Rubric

What we want to end up with is a well-written, Medium article-like, `README.md` on a Git repo that you can proudly pin under your GitHub profile.

### Write Up

In the project write up (the `README.md` for defining the scope), you should include:

- an explanation of the expected outputs of the project
- a human-readable description of the queries you're trying to run, and how their results will be used
- why did you choose the technologies you chose
- why did you choose the data model you chose (were there any gotchas or learning moments?)
- an explanation of the steps you followed according to the above `Steps` section
- diagrams of the DAG in your ETL process
- diagrams of the data model
- the screenshots as described in the `Steps` section
- discuss some alternatives considered, and why you ultimately went the way you went
- discuss some ways to expand your buildout or analysis:
  - what if the batch size of the data was increased by 100x
  - what if one of your sources were a streaming source
  - what if you needed a dashboard updated or a report generated and in an executive's inbox at 9AM every day
  - what if you needed to expose the results of your data model to dozens of other data engineers, data scientists or data analysts?

### Data Quality Checks

You need to include at least 2 data quality checks per source.

### ETL Code

Your code should be modular, unit tested and linted according to PEP8 guidelines. Your code should also run without errors.

### Project Scoping

The use case/goal of your capstone needs to be a real, non-trivial use case and your design/code needs to satisfy that goal end-to-end.

### Publishing

You should post this write up, in a public GitHub repo under your GitHub account, and pin it.

In addition, please consider actually posting your writeup and Git repo to a medium article!! Often, you'll make connections, find new opportunities, or learn new things just from posting something. The best time to post an imperfect project will always be today.

## Example Data Sources

- [Google Dataset Search](https://datasetsearch.research.google.com/)
- [Kaggle Datasets](https://www.kaggle.com/datasets)
- [GitHub: Awesome Public Datasets](https://github.com/awesomedata/awesome-public-datasets)
- [Data.gov](https://catalog.data.gov/dataset)
- [Dataquest: 18 places to find data sets for data science projects](https://www.dataquest.io/blog/free-datasets-for-projects/)
- [KDnuggets: Datasets for Data Mining and Data Science](https://www.kdnuggets.com/datasets/index.html)
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/datasets)
- [Reddit r/datasets/](https://www.reddit.com/r/datasets/)

[Here](https://www.kaggle.com/datasets/hugomathien/soccer) is an example of a dataset where someone took disparate data sets, and combined them into a qwell-used datasets on Kaggle.
[Here is a list of popular APIs](https://rapidapi.com/blog/most-popular-apis-2018/).

## Stand Out

If you really want to stand out, here are some suggestions

- use truly large data (multiple-many GB; just don't run up a huge cloud bill!!)
- spend a good amount of time on your data model and DAG diagram so that it doesn't just become a bell and whistle readers pass over
  - make sure its accurate and complete (not outdated)
  - make sure they're easy to read and understand
  - use similar language in your ETL code as much as possible to make it unambiguous how the diagrams map onto your code
- use more than 2 disparate sources
- make your frontend interactive
- power some sort of business logic frontend based on the analytical results
- post your dataset on Kaggle as a Kaggle data set! Maybe you can earn some medals and recongitiont here