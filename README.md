# 📊 Economic Indicators Analysis Tool

## Table of Contents
- [📖 Introduction](#introduction)
- [📋 Project Proposal](#project-proposal)
  - [📈 Objectives](#objectives)
  - [📊 Data Sources](#data-sources)
  - [🛠️ Technologies Used](#technologies-used)
  - [🔍 Use Cases](#use-cases)
- [🚀 Implementation Steps](#implementation-steps)
  - [1. Problem Identification](#1-problem-identification)
  - [2. Data Collection](#2-data-collection)
  - [3. Data Exploration and Assessment](#3-data-exploration-and-assessment)
  - [4. Data Modeling](#4-data-modeling)
  - [5. ETL Pipeline Development](#5-etl-pipeline-development)
  - [6. Data Quality Checks](#6-data-quality-checks)
  - [7. Analysis and Visualization](#7-analysis-and-visualization)
- [📊 Project Rubric](#project-rubric)
- [📤 Submission Instructions](#submission-instructions)
- [🌟 Additional Features](#additional-features)

## 📖 Introduction

The goal of this project is to create a tool that assesses the validity of financial reports by analyzing economic indicator data. The tool will help determine if a "rosy picture" presented by financial bodies is accurate or misleading. This project will focus on three verticals: MacroEconomic Indicators (GDP, Employment, CPI), Financial Markets (Total Market Cap, Interest Rates, Exchange Rates), and Housing and Real Estate (Home Prices, Starts and Permits, Mortgage Rates). The data will be retrieved from Alpha Vantage and other sources.

## 📋 Project Proposal

### 📈 Objectives
1. **Data Collection**: Retrieve and store economic indicator data from Alpha Vantage and other relevant sources.
2. **Data Analysis**: Analyze the collected data to identify trends and correlations.
3. **Validation Tool**: Develop a tool that assesses the accuracy of financial reports by comparing reported data against historical trends and other indicators.
4. **Visualization**: Create visualizations to aid in understanding and presenting the analysis results.

### 📊 Data Sources
- **Alpha Vantage**: For MacroEconomic Indicators, Financial Markets data, and Housing and Real Estate data.
- **Federal Reserve Economic Data (FRED)**: For supplementary economic indicators.
- **Other APIs**: As needed to enrich the dataset.

### 🛠️ Technologies Used
- **Python 3.12**: For data collection, processing, and analysis.
- **Pandas**: For data manipulation and analysis.
- **Alpha Vantage API**: For data retrieval.
- **Jupyter Notebook**: For development and testing.
- **Matplotlib/Seaborn**: For data visualization.
- **SQL**: For data storage and retrieval.
- **Airflow**: For orchestrating the ETL pipelines.
- **dbt (Data Build Tool)**: For data transformations.
- **Docker**: For containerizing the application and dependencies.

### 🔍 Use Cases
1. **Report Validation**: Assess the accuracy of financial reports by comparing reported data against historical trends and other indicators.
2. **Trend Analysis**: Identify trends in economic indicators and correlate them with financial market data.
3. **Decision Support**: Provide insights to support financial decision-making based on data analysis.

## 🚀 Implementation Steps

### 1. Problem Identification
Identify the key problem to be solved: validating the accuracy of financial reports by analyzing economic indicator data.

### 2. Data Collection
- Use the Alpha Vantage API to collect data on MacroEconomic Indicators, Financial Markets, and Housing and Real Estate.
- Collect additional data from FRED and other sources to enrich the dataset.
- Store the data in a structured format (e.g., CSV, JSON, SQL database).

### 3. Data Exploration and Assessment
- Perform Exploratory Data Analysis (EDA) to understand the data structure, identify missing values, and assess data quality.
- Document the data cleaning and preprocessing steps required.

### 4. Data Modeling
- Create a data model to define how the data will be stored and accessed.
- Use diagramming software to visualize the data model.

### 5. ETL Pipeline Development
- Develop ETL pipelines using **Airflow** for orchestration and **dbt** for data transformations.
- Use **Python 3.12** and relevant libraries to build the pipelines.
- Containerize the ETL process using Docker to ensure consistent environments and easy deployment.

### 6. Data Quality Checks
- Implement data quality checks to ensure the accuracy and reliability of the data.
- Include checks for referential integrity, data consistency, and completeness.

### 7. Analysis and Visualization
- Develop analytical methods to validate financial reports against historical trends and other indicators.
- Create visualizations to present the analysis results clearly and effectively.

## 📊 Project Rubric

### Criteria 1: Project Spec
- Detailed description of schemas, technical information, and metrics.
- Include screenshots of ETL runs, data quality checks, and visualizations.

### Criteria 2: Write Up
- Explanation of project outputs, queries, data sets, technologies, and data models.
- Discuss project scope, steps followed, and alternatives considered.

### Criteria 3: Data Quality Checks
- Include at least 2 data quality checks per data source.

### Criteria 4: ETL Code
- Ensure modular, unit tested, and PEP8-compliant code.

### Criteria 5: Project Scoping
- Address a real, non-trivial use case with end-to-end design and code.

## 📤 Submission Instructions
1. **Visit the Assignments Page**: Navigate to [dataexpert.io/assignments](https://dataexpert.io/assignments) and use the GitHub Classroom link for submission.
2. **Select Your Team Members**: Use the link to create a repository with your team members.
3. **Repository Permissions**: Ensure proper permissions for TA access and evaluation.

## 🌟 Additional Features
- Use large datasets and multiple data sources.
- Create interactive visualizations and dashboards.
- Post the dataset on Kaggle for wider recognition.

### Publishing
- Consider publishing the write-up and Git repo as a Medium article to gain visibility and feedback.