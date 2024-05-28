
# Project Proposal: Integrated Economic and Financial Data Analysis System

## Project Overview

**Project Name:** Economic and Financial Data Analysis System

**Team**
- Jesse (Jess) Charbneau - https://www.linkedin.com/in/jcharbneau
- Aleem Rahil - https://www.linkedin.com/in/aleemrahil/
- Anjana Shivangi - https://www.linkedin.com/in/anjana-shivangi

**Objective:** To develop an integrated system that retrieves, stores, and analyzes economic and financial data from multiple sources to identify and correlate cause-and-effect relationships between various economic indicators and financial market trends. The system will also overlay significant government interventions, such as changes in interest rates, tax breaks, and currency policies, to provide a comprehensive view of market dynamics.

**Key Features:**
1. **Data Retrieval:** Automate the retrieval of historical and daily economic data from the Federal Reserve Economic Data (FRED) and financial data from Alpha Vantage.
2. **Data Storage:** Store the retrieved data in PostgreSQL.
3. **Data Analysis:** Perform advanced data analysis to uncover insights and correlations using statistical methods.
4. **Overlay Government Interventions:** Integrate significant government events and policies to overlay them on economic and financial data visualizations.
5. **Credit Card Volume and Delinquency Analysis:** Incorporate strategies to analyze credit card volume and delinquency using data from FRED or Alpha Vantage.
6. **Large Dataset Integration:** Ensure at least one dataset has a large footprint (over a million rows) to meet final exam targets.
7. **Future Integration:** Incorporate Apache Spark, Flink, and Kafka for real-time data processing, streaming, and enhanced analytical capabilities.

## Background and Motivation

Understanding the interplay between economic indicators and financial markets is crucial for making informed decisions in finance, economics, and policy-making. Traditional methods of data analysis often lack the ability to dynamically update and process large volumes of data in real-time. Additionally, government interventions can significantly impact market dynamics. This project aims to bridge these gaps by leveraging modern data processing technologies to create a robust, scalable, and real-time capable system.

As part of this effort, we anticipate making a decision about which datasets would be most useful by May 31st including identification of the pipelines we intend to incorporate and what insights they will provide in determining economic indicators and correlative impact.
### Explorative Datasets
**Federal Reserve Datasets**
<pre><code>
jess@jess-mac-dev ~/Documents/development/learning/dataengineer.io/bootcamp4/rosy_economics_capstone/project_notes/sample_datasets => python lookup_fred_description.py 
File: PAYEMS.csv -> Dataset Name: All Employees, Total Nonfarm
File: JTSJOL.csv -> Dataset Name: Job Openings: Total Nonfarm
File: WILL5000PR.csv -> Dataset Name: Wilshire 5000 Price Index
File: MSPUS.csv -> Dataset Name: Median Sales Price of Houses Sold for the United States
File: MORTGAGE15US.csv -> Dataset Name: 15-Year Fixed Rate Mortgage Average in the United States
File: GS10.csv -> Dataset Name: Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity, Quoted on an Investment Basis
File: DRCCLACBS.csv -> Dataset Name: Delinquency Rate on Credit Card Loans, All Commercial Banks
File: LNS13023621.csv -> Dataset Name: Unemployment Level - Job Losers
File: MORTGAGE30US.csv -> Dataset Name: 30-Year Fixed Rate Mortgage Average in the United States
Error retrieving data for stock_data_last_35_years: Bad Request.  Invalid value for variable series_id.  Series IDs should be 25 or less alphanumeric characters.
File: stock_data_last_35_years.csv -> Dataset Name: Not Found
File: CPILFESL.csv -> Dataset Name: Consumer Price Index for All Urban Consumers: All Items Less Food and Energy in U.S. City Average
File: REVOLSL.csv -> Dataset Name: Revolving Consumer Credit Owned and Securitized
File: UNRATE.csv -> Dataset Name: Unemployment Rate
File: ICSA.csv -> Dataset Name: Initial Claims
File: NONREVSL.csv -> Dataset Name: Nonrevolving Consumer Credit Owned and Securitized
File: DRSFRMACBS.csv -> Dataset Name: Delinquency Rate on Single-Family Residential Mortgages, Booked in Domestic Offices, All Commercial Banks
File: CPIAUCSL.csv -> Dataset Name: Consumer Price Index for All Urban Consumers: All Items in U.S. City Average
File: FEDFUNDS.csv -> Dataset Name: Federal Funds Effective Rate
File: HSN1F.csv -> Dataset Name: New One Family Houses Sold: United States
File: EFFR.csv -> Dataset Name: Effective Federal Funds Rate
File: FYFSD.csv -> Dataset Name: Federal Surplus or Deficit [-]
File: RSXFS.csv -> Dataset Name: Advance Retail Sales: Retail Trade
File: GDP.csv -> Dataset Name: Gross Domestic Product
File: TOTALSL.csv -> Dataset Name: Total Consumer Credit Owned and Securitized
jess@jess-mac-dev ~/Documents/development/learning/dataengineer.io/bootcamp4/rosy_economics_capstone/project_notes/sample_datasets =>
</code>
</pre>

**Stock Data**

In order to meet the objective of having at least one dataset that is over 1m rows, we are exploring options using Yahoo Finance to get the last 35 years of data on a large swath of companies, including those from the Technology, Energy, Retail and other industries.  Our test dataset is 1.3m rows, and includes the following stock ticker -> companies. 
The file is 30+mb gzipped, so we have opted to provide a facility to download it.  If unable to use this project, a downloaded copy has been placed at https://www.jessecharbneau.com/downloads/stock_data_last_35_years.csv.gz.  We are also considering options to identify which vertical or industry a company belongs to, in order to classify and then identify trends around the economic indicators and if there is correlative data to show which industries are more affected by interventions and/or large economic impacts.

<pre><code>
jess@jess-mac-dev ~/Documents/development/learning/dataengineer.io/bootcamp4/rosy_economics_capstone/project_notes/sample_datasets => python lookup_stock_company.py 
Stock Ticker | Company Name                           | Industry
--------------------------------------------------------------------------------
AAPL         | Apple Inc.                               | Consumer Electronics
MSFT         | Microsoft Corporation                    | Software - Infrastructure
IBM          | International Business Machines Corporation | Information Technology Services
GE           | General Electric Company                 | Aerospace & Defense
KO           | The Coca-Cola Company                    | Beverages - Non-Alcoholic
JNJ          | Johnson & Johnson                        | Drug Manufacturers - General
XOM          | Exxon Mobil Corporation                  | Oil & Gas Integrated
PG           | The Procter & Gamble Company             | Household & Personal Products
MCD          | McDonald's Corporation                   | Restaurants
WMT          | Walmart Inc.                             | Discount Stores
T            | AT&T Inc.                                | Telecom Services
MRK          | Merck & Co., Inc.                        | Drug Manufacturers - General
PFE          | Pfizer Inc.                              | Drug Manufacturers - General
CVX          | Chevron Corporation                      | Oil & Gas Integrated
BA           | The Boeing Company                       | Aerospace & Defense
PEP          | PepsiCo, Inc.                            | Beverages - Non-Alcoholic
VZ           | Verizon Communications Inc.              | Telecom Services
V            | Visa Inc.                                | Credit Services
CSCO         | Cisco Systems, Inc.                      | Communication Equipment
INTC         | Intel Corporation                        | Semiconductors
WBA          | Walgreens Boots Alliance, Inc.           | Pharmaceutical Retailers
NKE          | NIKE, Inc.                               | Footwear & Accessories
DIS          | The Walt Disney Company                  | Entertainment
MMM          | 3M Company                               | Conglomerates
HON          | Honeywell International Inc.             | Conglomerates
AMGN         | Amgen Inc.                               | Drug Manufacturers - General
CAT          | Caterpillar Inc.                         | Farm & Heavy Construction Machinery
RTX          | RTX Corporation                          | Aerospace & Defense
GS           | The Goldman Sachs Group, Inc.            | Capital Markets
AXP          | American Express Company                 | Credit Services
LMT          | Lockheed Martin Corporation              | Aerospace & Defense
MO           | Altria Group, Inc.                       | Tobacco
CMCSA        | Comcast Corporation                      | Telecom Services
DHR          | Danaher Corporation                      | Diagnostics & Research
ORCL         | Oracle Corporation                       | Software - Infrastructure
MDT          | Medtronic plc                            | Medical Devices
GILD         | Gilead Sciences, Inc.                    | Drug Manufacturers - General
BMY          | Bristol-Myers Squibb Company             | Drug Manufacturers - General
COST         | Costco Wholesale Corporation             | Discount Stores
TGT          | Target Corporation                       | Discount Stores
LOW          | Lowe's Companies, Inc.                   | Home Improvement Retail
HD           | The Home Depot, Inc.                     | Home Improvement Retail
SBUX         | Starbucks Corporation                    | Restaurants
FDX          | FedEx Corporation                        | Integrated Freight & Logistics
UPS          | United Parcel Service, Inc.              | Integrated Freight & Logistics
GM           | General Motors Company                   | Auto Manufacturers
F            | Ford Motor Company                       | Auto Manufacturers
TSLA         | Tesla, Inc.                              | Auto Manufacturers
NFLX         | Netflix, Inc.                            | Entertainment
NVDA         | NVIDIA Corporation                       | Semiconductors
ADBE         | Adobe Inc.                               | Software - Infrastructure
QCOM         | QUALCOMM Incorporated                    | Semiconductors
AVGO         | Broadcom Inc.                            | Semiconductors
TXN          | Texas Instruments Incorporated           | Semiconductors
AMD          | Advanced Micro Devices, Inc.             | Semiconductors
INTU         | Intuit Inc.                              | Software - Application
AMAT         | Applied Materials, Inc.                  | Semiconductor Equipment & Materials
MU           | Micron Technology, Inc.                  | Semiconductors
LRCX         | Lam Research Corporation                 | Semiconductor Equipment & Materials
KLAC         | KLA Corporation                          | Semiconductor Equipment & Materials
HPQ          | HP Inc.                                  | Computer Hardware
DELL         | Dell Technologies Inc.                   | Computer Hardware
CSX          | CSX Corporation                          | Railroads
UNP          | Union Pacific Corporation                | Railroads
NSC          | Norfolk Southern Corporation             | Railroads
KSU          | N/A                                      | N/A
UAL          | United Airlines Holdings, Inc.           | Airlines
DAL          | Delta Air Lines, Inc.                    | Airlines
AAL          | American Airlines Group Inc.             | Airlines
LUV          | Southwest Airlines Co.                   | Airlines
JBLU         | JetBlue Airways Corporation              | Airlines
SWA          | N/A                                      | N/A
XEL          | Xcel Energy Inc.                         | Utilities - Regulated Electric
NEE          | NextEra Energy, Inc.                     | Utilities - Regulated Electric
DUK          | Duke Energy Corporation                  | Utilities - Regulated Electric
SO           | The Southern Company                     | Utilities - Regulated Electric
AEP          | American Electric Power Company, Inc.    | Utilities - Regulated Electric
D            | Dominion Energy, Inc.                    | Utilities - Regulated Electric
EXC          | Exelon Corporation                       | Utilities - Regulated Electric
PEG          | Public Service Enterprise Group Incorporated | Utilities - Regulated Electric
PCG          | PG&E Corporation                         | Utilities - Regulated Electric
EIX          | Edison International                     | Utilities - Regulated Electric
PPL          | PPL Corporation                          | Utilities - Regulated Electric
FE           | FirstEnergy Corp.                        | Utilities - Regulated Electric
ED           | Consolidated Edison, Inc.                | Utilities - Regulated Electric
NRG          | NRG Energy, Inc.                         | Utilities - Independent Power Producers
AES          | The AES Corporation                      | Utilities - Diversified
CMS          | CMS Energy Corporation                   | Utilities - Regulated Electric
DTE          | DTE Energy Company                       | Utilities - Regulated Electric
ETR          | Entergy Corporation                      | Utilities - Regulated Electric
AEE          | Ameren Corporation                       | Utilities - Regulated Electric
WEC          | WEC Energy Group, Inc.                   | Utilities - Regulated Electric
ES           | Eversource Energy                        | Utilities - Regulated Electric
ATO          | Atmos Energy Corporation                 | Utilities - Regulated Gas
NI           | NiSource Inc.                            | Utilities - Regulated Gas
CNP          | CenterPoint Energy, Inc.                 | Utilities - Regulated Electric
PNW          | Pinnacle West Capital Corporation        | Utilities - Regulated Electric
OGE          | OGE Energy Corp.                         | Utilities - Regulated Electric
IDA          | IDACORP, Inc.                            | Utilities - Regulated Electric
ALB          | Albemarle Corporation                    | Specialty Chemicals
PXD          | Pioneer Natural Resources Company        | Oil & Gas E&P
EOG          | EOG Resources, Inc.                      | Oil & Gas E&P
HAL          | Halliburton Company                      | Oil & Gas Equipment & Services
SLB          | Schlumberger Limited                     | Oil & Gas Equipment & Services
BKR          | Baker Hughes Company                     | Oil & Gas Equipment & Services
DVN          | Devon Energy Corporation                 | Oil & Gas E&P
COP          | ConocoPhillips                           | Oil & Gas E&P
XEC          | N/A                                      | N/A
OXY          | Occidental Petroleum Corporation         | Oil & Gas E&P
APA          | APA Corporation                          | Oil & Gas E&P
FANG         | Diamondback Energy, Inc.                 | Oil & Gas E&P
HES          | Hess Corporation                         | Oil & Gas E&P
MRO          | Marathon Oil Corporation                 | Oil & Gas E&P
CLR          | N/A                                      | N/A
CXO          | N/A                                      | N/A
MTDR         | Matador Resources Company                | Oil & Gas E&P
PSX          | Phillips 66                              | Oil & Gas Refining & Marketing
VLO          | Valero Energy Corporation                | Oil & Gas Refining & Marketing
MPC          | Marathon Petroleum Corporation           | Oil & Gas Refining & Marketing
HFC          | N/A                                      | N/A
DK           | Delek US Holdings, Inc.                  | Oil & Gas Refining & Marketing
BP           | BP p.l.c.                                | Oil & Gas Integrated
RDS.A        | N/A                                      | N/A
RDS.B        | N/A                                      | N/A
TOT          | N/A                                      | N/A
E            | Eni S.p.A.                               | Oil & Gas Integrated
ENB          | Enbridge Inc.                            | Oil & Gas Midstream
TRP          | TC Energy Corporation                    | Oil & Gas Midstream
KMI          | Kinder Morgan, Inc.                      | Oil & Gas Midstream
WMB          | The Williams Companies, Inc.             | Oil & Gas Midstream
OKE          | ONEOK, Inc.                              | Oil & Gas Midstream
EPD          | Enterprise Products Partners L.P.        | Oil & Gas Midstream
ET           | Energy Transfer LP                       | Oil & Gas Midstream
MPLX         | MPLX LP                                  | Oil & Gas Midstream
PAA          | Plains All American Pipeline, L.P.       | Oil & Gas Midstream
jess@jess-mac-dev ~/Documents/development/learning/dataengineer.io/bootcamp4/rosy_economics_capstone/project_notes/sample_datasets => 
</code></pre>
## Project Components

1. **Data Retrieval**
    - **FRED API:** Fetch historical and daily updates for macroeconomic indicators such as GDP, inflation rates, employment rates, etc.
    - **Yahoo Finance API:** Retrieve historical and daily updates for financial market data such as stock prices (e.g., S&P 500), interest rates, and exchange rates.
    - **Intraday Stock Prices:** Fetch minute-by-minute or hourly stock prices for major indices or stocks to ensure a large dataset.
    - **Credit Card Data:** Retrieve data on credit card volume and delinquency rates from FRED or Alpha Vantage.

2. **Data Storage**
    - **Postgres:** As this is not a huge amount of data, and in the interest of time; we have decided to use PostgreSQL + Docker.
    - **Apache Airflow:** Automate the data retrieval and storage processes using Airflow DAGs to ensure data is updated daily.

3. **Data Analysis**
    - **Correlation Analysis:** Use statistical methods to identify relationships between economic indicators and financial market performance.
    - **Visualization:** Create visualizations to depict these relationships and make insights easily understandable.
    - **Overlay Government Interventions:** Integrate data on government policies and significant events, such as interest rate changes, tax breaks, and currency policies, and overlay them on visualizations to provide context to the data.
    - **Credit Card Analysis:** Analyze credit card volume and delinquency trends and correlate them with other economic indicators.

4. **Future Integration and Enhancements**
    - **Apache Spark:** Incorporate Spark for large-scale data processing and advanced analytics.
    - **Apache Flink:** Utilize Flink for real-time data streaming and processing, enabling near real-time analytics and insights.
    - **Apache Kafka:** Integrate Kafka for reliable and scalable data streaming, ensuring seamless data flow between various components of the system.

## Implementation Plan

1. **Phase 1: Initial Setup and Data Retrieval**
    - ✅ Download Fred and Yahoo Finance datasets for Aleem and Anjana to begin review
    - 🚧 Set up Apache Airflow, Postgres and Jupyter Docker containers (including compose)
    - ⬜ Begin developing DAGs for data retrieval from FRED and Yahoo Finance
      - Yahoo Datasets
        - Daily
        - Hourly: Note Yahoo Finance allows only the last 7 days for hour by hour data
      - Download identified FRED datasets, on a daily basis
      - Identify strategy to back-fill as much data as possible, going back at least 35 years

2. **Phase 2: Data Analysis and Visualization**
    - ⬜ Implement preprocessing and alignment of data from different sources.
    - ⬜ Perform correlation analysis to identify significant relationships.
    - ⬜ Create visualizations to represent the findings.
    - ⬜ Integrate and overlay government interventions on the visualizations.
    - ⬜ Implement strategies to analyze credit card volume and delinquency data.


3. **Phase 3: Testing and Deployment**
    - Conduct thorough testing of all components and ensure seamless integration.
    - Deploy the system in a production environment.
    - Monitor and maintain the system, ensuring it runs smoothly and efficiently.

## Potential Use Cases

1. **Real-Time Economic Monitoring:** Continuously monitor and analyze the economic indicators and financial markets to provide real-time insights for economists, policymakers, and financial analysts.
2. **Predictive Analytics:** Use historical data to develop predictive models that forecast future economic and financial trends.
3. **Risk Management:** Help financial institutions and businesses manage risk by understanding the impact of economic changes on financial markets.
4. **Investment Strategies:** Inform investment strategies by identifying correlations between macroeconomic indicators and market performance.
5. **Policy Impact Analysis:** Evaluate the impact of government interventions on the economy and financial markets, providing valuable insights for policy-making.
6. **Credit Card Risk Analysis:** Assess credit card volume and delinquency trends to inform risk management strategies for financial institutions.

## POC Idea Development

To isolate behavior, we first identified some areas of interest for this project using a conceptual data modeling exercise as discussed in the coursework.

**Conceptual Data Model**

![POC Conceptual Data Model](project_notes/screenshots/poc_conceptual_data_model.png)

**POC React+ChartJS with FastAPI+Matplotlib for tooling display**

While simplistic, these screenshots illustrate the idea of rapid comparison of various metrics to systemic impacts from Government interventions.
![POC Screenshot 1](project_notes/screenshots/poc_screenshot1.png)

![POC Screenshot 2](project_notes/screenshots/poc_screenshot2.png)

## Conclusion

The Rosy Economix application will provide a powerful tool for understanding and analyzing the complex relationships between economic indicators and financial markets. By leveraging modern data processing technologies such as Apache Spark, Flink, and Kafka, and integrating government intervention data and credit card analysis, the system will be capable of real-time data processing and advanced analytics, offering valuable insights for a wide range of stakeholders.

**Next Steps:**
- Finalize the project plan and gather the necessary resources.
- Initiate Phase 1 with the setup of Airflow, Trino, and S3 Iceberg tables.
- Develop and test the initial data retrieval and storage scripts.

We look forward to embarking on this project and unlocking new insights into the economic and financial landscape.

The Economic and Financial Data Analysis System will provide a powerful tool for understanding and analyzing the complex relationships between economic indicators and financial markets. By leveraging modern data processing technologies such as Apache Spark, Flink, and Kafka, and integrating government intervention data and credit card analysis, the system will be capable of real-time data processing and advanced analytics, offering valuable insights for a wide range of stakeholders.

**Next Steps:**
- Finalize the project plan and identify datasets and begin finalizing the data model.
- Complete the build out of the target Compose environment
- Develop and test the initial data retrieval and storage scripts.

We look forward to embarking on this project and unlocking new insights into the economic and financial landscape.

