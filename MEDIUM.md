# Unveiling Economic Insights with Advanced Data Processing: The Rosy Economix Capstone Project

In today’s data-driven world, understanding the intricate relationships between economic indicators and financial markets is paramount. This article delves into the Rosy Economix Capstone Project, a sophisticated initiative aimed at leveraging modern data processing technologies to analyze and decode economic trends. Let’s explore the objectives, tools, datasets, and the roadmap of this ambitious project.

## Project Overview

The Rosy Economix Capstone Project aims to develop a comprehensive system capable of real-time data processing and advanced analytics. By integrating various economic datasets with cutting-edge technologies, we seek to provide valuable insights for stakeholders in the financial domain.

## Objectives

The primary objective is to create a platform that can:
- Analyze economic indicators and their impact on financial markets.
- Classify companies by verticals or industries and identify trends.
- Correlate data to understand the effect of economic interventions and large impacts.

## Tools and Technologies

To achieve our objectives, we are utilizing a suite of powerful tools and technologies:
- **Airflow** for workflow management.
- **PostgreSQL** as our database system.
- **Docker** to streamline environment setup.
- **ReactJS** and **FastAPI** for the application side.

Future iterations will migrate much of the ingestion and storage to utilize:
- **Trino (formerly PrestoSQL)** for distributed SQL query execution.
- **Apache Iceberg** for handling large analytic tables.
- **AWS S3** for storage
- **Apache Spark / Glue** for ingestion and processing

## Key Datasets

### FRED (Federal Reserve Economic Data)
FRED offers a wealth of economic data, including credit delinquency rates, credit volumes, and various financial indicators. Our project focuses on critical datasets like GDP, CPI, and unemployment rates to build robust economic models.

### Stock Data
To meet the objective of analyzing over a million rows of data, we leverage Yahoo Finance’s extensive historical stock data. This dataset covers the last 35 years and includes companies from diverse industries such as Technology, Energy, and Retail. The dataset, available for download [here](https://www.jessecharbneau.com/downloads/stock_data_last_35_years.csv.gz), contains 1.3 million rows and details like stock ticker, company name, and industry classification.

Here’s a glimpse of the dataset:

| Stock Ticker | Company Name | Industry |
|--------------|--------------|----------|
| AAPL         | Apple Inc.   | Consumer Electronics |
| MSFT         | Microsoft Corporation | Software - Infrastructure |
| IBM          | International Business Machines Corporation | Information Technology Services |
| GE           | General Electric Company | Aerospace & Defense |
| KO           | The Coca-Cola Company | Beverages - Non-Alcoholic |
| JNJ          | Johnson & Johnson | Drug Manufacturers - General |
| XOM          | Exxon Mobil Corporation | Oil & Gas Integrated |
| PG           | The Procter & Gamble Company | Household & Personal Products |
| MCD          | McDonald’s Corporation | Restaurants |
| WMT          | Walmart Inc. | Discount Stores |

**In the future, we'll move much of the data collection to using Polygon.IO or similar service that exposes S3 as the endpoint, and ingest and process using Spark**

## Project Implementation and Notes

- **Docker Setup**: We utilized Docker to manage the environment for ReactJS, FastAPI, and PostgreSQL.
- **Airflow**: Airflow is set up and ready, but using the Yahoo Finance API for more than 500 stock tickers proved slow. While a DAG is stubbed out, it’s basic and does not perform data updates at this time.
- **Astro Compose Environment**: Overrode the Astro Compose environment to facilitate hosting the React and FastAPI environments.
- **Data Analysis and Visualizations**: Spent considerable time on data analysis, particularly visualizations, to answer key questions using the available data.
- **OpenAI Integration**: OpenAI integration has opened up a world of analytical opportunity. The simplistic implementation has already revealed the ability for OpenAI to review generated charts and graphs and provide feedback that is both concise but seemingly accurate. Further discussions with economists are lined up to get feedback on how this is working. Additionally, ML contacts have been engaged to help identify prompt development opportunities and challenges. The ability to layer in defined markers and have the AI engine account for those changes, and update analysis based on potential impact markers has been extremely impressive.

## Key Questions and Visualizations

Here are the key questions we aimed to answer, along with some visualizations that provide insights:

### Economic Indicators
1. **How do GDP growth rates correlate with stock market performance?**

   ![GDP Growth Rate vs Stock Market Return](project_notes/screenshots/ex_gdp_growth_rate_vs_stock_returns.png)

2. **What is the relationship between unemployment rates and consumer spending?**

   ![Unemployment Rate vs Consumer Spending](project_notes/screenshots/unemp_rate_vs_consumer_spending.png)

3. **How do inflation rates impact the stock prices of different sectors?**

   ![Inflation Rate vs Stock Prices by Sector](project_notes/screenshots/inflation_rate-vs_stock_prices_by_sector.png)

### Stock Market Analysis
1. **Which sectors have shown the highest growth over the past decade?**

   ![Sector Growth Over the Past Decade](project_notes/screenshots/sector_growth_paste_decade.png)

### Insights and Visualization

The following screenshots demonstrate some of the insights derived from the data:

![GDP and Economic Indicators](project_notes/screenshots/econ_ind.gdp_cpi_ur_over_time_w_annotations.png)
![GDP and Economic Indicators - AI Loading](project_notes/screenshots/econ_ind.gdp_cpi_ur.ai_loading.png)
![GDP and Economic Indicators - AI Feedback](project_notes/screenshots/econ_ind.gdp_cpi_ur.ai_loaded.png)

### Additional Questions Identified
- **How has consumer credit delinquency evolved over time, and what are the implications for financial stability?**
- **What are the trends in corporate debt issuance and repayment?**
- **How do changes in federal interest rates affect the stock market?**
- **What is the impact of government spending on economic growth?**
- **How does stock volatility differ between large-cap and small-cap companies?**
- **What are the most common characteristics of companies that have consistently outperformed the market?**
- **Which stocks have the most favorable P/E (Price-to-Earnings) ratios?**
- **What are the historical trends in stock splits and their impact on stock prices?**

## Conclusion

The Rosy Economix Capstone Project promises to unlock new insights into the economic and financial landscape. By combining state-of-the-art data processing technologies with comprehensive economic datasets, we aim to offer a powerful tool for analysts, investors, and policymakers. Stay tuned as we embark on this journey to decode the complex world of economic indicators and financial markets.
