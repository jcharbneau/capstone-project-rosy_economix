# 🎓 Capstone Project

## Table of Contents
- [📖 Introduction](#-introduction)
- [🛠️ Steps](#-steps)
- [📊 Rubric](#-rubric)
  - [👉 Criteria 1: Project Spec](#-criteria-1-project-spec)
  - [👉 Criteria 2: Write Up](#-criteria-2-write-up)
  - [👉 Criteria 3: Data Quality Checks](#-criteria-3-data-quality-checks)
  - [👉 Criteria 4: ETL Code](#-criteria-4-etl-code)
  - [👉 Criteria 5: Project Scoping](#-criteria-5-project-scoping)
- [📤 Project Submission Instructions](#-project-submission-instructions)
- [📚 Examples](#-examples)
  - [🔄 Dynamic Data Sets](#-dynamic-data-sets)
  - [🗃️ Static Data Sources](#-static-data-sources)
- [🌟 Stand Out](#-stand-out)
  - [📢 Publishing](#-publishing)
- [🏆 Top Submissions](#-top-submissions)



## 📖 Introduction

The purpose of the capstone project is to give students a chance to apply what they have learned throughout the boot camp. Think of this project as an important piece that you can add to your GitHub portfolio when applying for jobs.

In this project, we will give you some ideas for problems to solve and data sets to use, but it is **strongly encouraged** that students try and find their own data sets (perhaps create their own datasets) and come up with their own analysis. We would like to push students to not use datasets that are already well-understood and have many articles/public projects written about them (looking at you, iris/titanic/yellow cab taxi datasets).

You may work in groups of **up to** 3.



## 🛠️ Steps

To help structure the projects, students are encouraged to think of solving a series of steps:

1. **Identify a problem you'd like to solve.**
2. **Scope the project and figure out what datasets you're using.**
   - Use at least 2 different sources (with at least 2 different data sources/formats; i.e. csv, APIs, json, parquet), totaling at least 1 million rows.
   - Explain what use cases you are preparing the data for (is it an analytics table in a data warehouse, a relational database, a dashboard, etc.).
   - Identify a tech stack/choice of tools and defend your choices.
3. **Explore and assess the data.**
   - Identify data quality issues.
   - Perform EDA to become familiar with the data if needed (look at the ranges on values, categorical values, invalid values, etc.).
   - Document the steps you need to clean the data.
4. **Create a diagram defining the target data model.**
   - Use diagramming software to create a dimensional model of what the data will look like when your ETL is finished, and how the data will be served.
5. **Create a data dictionary** of the fields, any constraints on them, as well as data quality or transformations that need to be incorporated.
6. **Write the ETL pipelines** to transform the data.
   - Create the code for the data pipelines.
7. **Write code to check data quality** for the data quality checks you specified before:
   - Here are a few good tools for performing data quality checks:
     - dbt tests
     - pyspark chispa
     - pyspark deequ
     - python pandas pandera
     - python soap
     - python great expectations
   - Make sure to include any referential integrity constraint checks (since these usually aren't enforced in an analytical environment).
   - Make sure to include sanity row count checks.
8. **Run the ETL pipelines and data quality checks**, and include screenshots of:
   - Successful runs
   - Successful (or failing) data quality checks
   - Whatever analytical frontend you're displaying the data through (the dashboard, the application, plots of analytics, etc.)


## 📊 Rubric

What we want to end up with is a well-written, Medium article-like, `README.md` on a Git repo that you can proudly pin under your GitHub profile.

Below, we've shared a few examples of websites with static data sets (i.e. Kaggle). The meat/bulk of your project/pipeline has to be an ETL pipeline that's integrated against a live API or data feed. You may use the static data sets as dimensions for enrichment, but your project should be centered around a live data feed.

There has to be a recurring pipeline job that fires off to run your transformations and validations.


###  👉 Criteria 1: Project Spec

The project spec is a more terse description of all the schemas and technical information used in your project.

Include:
- Schemas
- Screenshots (as described in the `Steps` section)
- Diagrams (for your DAG, and of the data model)
- Metrics
- Data quality checks

The write-up is a more verbose, expository high-level description of your project.


###  👉 Criteria 2: Write Up

In the project write-up (the `README.md` for defining the scope), you should include:

- An explanation of the expected outputs of the project
- A human-readable description of the queries you're trying to run, and how their results will be used
- Justify why you chose the data sets you chose
- Why did you choose the technologies you chose
- Why did you choose the data model you chose (were there any gotchas or learning moments?)
- An explanation of the steps you followed according to the above `Steps` section
- Discuss some alternatives considered, and why you ultimately went the way you went
- Discuss some ways to expand your buildout or analysis:
  - What if the batch size of the data was increased by 100x?
  - What if one of your sources were a streaming source?
  - What if you needed a dashboard updated or a report generated and in an executive's inbox at 9AM every day?
  - What if you needed to expose the results of your data model to dozens of other data engineers, data scientists, or data analysts?


###  👉 Criteria 3: Data Quality Checks

You need to include at least 2 data quality checks per source.


###  👉 Criteria 4: ETL Code

Your code should be modular, unit tested, and linted according to PEP8 guidelines. Your code should also run without errors.


###  👉 Criteria 5: Project Scoping

The use case/goal of your capstone needs to be a real, non-trivial use case and your design/code needs to satisfy that goal end-to-end.


## 📤 Project Submission Instructions

To submit your capstone project, please use the GitHub Classroom link provided on our assignments page at [dataexpert.io/assignments](https://dataexpert.io/assignments). Follow these steps to ensure proper submission:

1. **Visit the Assignments Page:** Navigate to [dataexpert.io/assignments](https://dataexpert.io/assignments) and locate the GitHub Classroom link for the capstone project.
2. **Select Your Team Members:** The link will direct you to a page where you can select your team members (if you have any). Once selected, it will automatically create a blank, public repository with the necessary permissions for our TAs to access.
3. **Repository Permissions:** You and your group/teammates will have admin access to your repository, allowing you full control to manage your project.
4. **Importance of Using the Classroom Link:** Creating your own repository from your private accounts can make it difficult for our teams to access and review. Therefore, we ask that you use the GitHub Classroom link to submit your project. If you wish to add the project to your private accounts later, you can do so after submission.

**Note:** Using the GitHub Classroom link ensures that your project is easily accessible to our TAs for evaluation. This step is crucial for a smooth review process.

By following these steps, you will ensure that your project is correctly submitted and accessible for evaluation. If you have any questions or encounter issues during the submission process, please reach out to the support team.


## 🌟 Stand Out

If you really want to stand out, here are some suggestions:

- Use truly large data (multiple/many GB; just don't run up a huge cloud bill!)
- Use a streaming/real-time data set/use case
- Spend a good amount of time on your data model and DAG diagram so that it doesn't just become a bell and whistle readers pass over
  - Make sure it's accurate and complete (not outdated)
  - Make sure they're easy to read and understand
  - Use similar language in your ETL code as much as possible to make it unambiguous how the diagrams map onto your code
- Use more than 2 disparate sources
- Make your frontend interactive
- Power some sort of business logic frontend based on the analytical results
- Post your dataset on Kaggle as a Kaggle data set! Maybe you can earn some medals and recognition there
- Scrape your own dataset

### 📢 Publishing

Consider actually posting your write-up and Git repo to a Medium article! Often, you'll make connections, find new opportunities, or learn new things just from posting something. The best time to post an imperfect project will always be today.


## 📚 Examples

### 🔄 Dynamic Data Sets

- Consider RSS feeds (see [this article](https://medium.com/cloudera-inc/consuming-rss-feeds-from-flink-sql-eaf33c1a5a23) for examples on connecting Flink to an RSS feed)
- [Awesome Public Real Time Datasets GitHub Repo](https://github.com/bytewax/awesome-public-real-time-datasets)

### 🗃️ Static Data Sources

- [Awesome Public Data GitHub Repo](https://github.com/awesomedata/awesome-public-datasets)
- [Live Stock Market Data](https://polygon.io/)
- [Google Dataset Search](https://datasetsearch.research.google.com/)
- [Kaggle Datasets](https://www.kaggle.com/datasets)
- [GitHub: Awesome Public Datasets](https://github.com/awesomedata/awesome-public-datasets)
- [Data.gov](https://catalog.data.gov/dataset)
- [Dataquest: 18 places to find data sets for data science projects](https://www.dataquest.io/blog/free-datasets-for-projects/)
- [KDnuggets: Datasets for Data Mining and Data Science](https://www.kdnuggets.com/datasets/index.html)
- [UCI Machine Learning Repository](https://archive.ics.uci.edu/datasets)
- [Reddit r/datasets/](https://www.reddit.com/r/datasets/)

[Here](https://www.kaggle.com/datasets/hugomathien/soccer) is an example of a dataset where someone took disparate data sets, and combined them into a well-used dataset on Kaggle. [Here is a list of popular APIs](https://rapidapi.com/blog/most-popular-apis-2018/).


## 🏆 Top Submissions

The **top 3** submissions (this will be determined based on how heavily the  👉 criteria are developed and group size) will be featured on the DataExpert.io blog!
