import yfinance as yf
import pandas as pd
import datetime

# Define the list of stock tickers you want to download
tickers = [
    "AAPL", "MSFT", "IBM", "GE", "KO", "JNJ", "XOM", "PG", "MCD", "WMT", "T", "MRK", "PFE", "CVX", "BA",
    "PEP", "VZ", "V", "CSCO", "INTC", "WBA", "NKE", "DIS", "MMM", "HON", "AMGN", "CAT", "RTX", "GS",
    "AXP", "LMT", "MO", "CMCSA", "DHR", "ORCL", "MDT", "GILD", "BMY", "COST", "TGT", "LOW", "HD",
    "SBUX", "FDX", "UPS", "GM", "F", "TSLA", "NFLX", "NVDA", "ADBE", "QCOM", "AVGO", "TXN", "AMD",
    "INTU", "AMAT", "MU", "LRCX", "KLAC", "HPQ", "DELL", "CSX", "UNP", "NSC", "KSU", "UAL", "DAL",
    "AAL", "LUV", "JBLU", "SWA", "XEL", "NEE", "DUK", "SO", "AEP", "D", "EXC", "PEG", "PCG", "EIX",
    "PPL", "FE", "ED", "NRG", "AES", "CMS", "DTE", "ETR", "AEE", "WEC", "ES", "ATO", "NI", "CNP",
    "PNW", "OGE", "IDA", "ALB", "PXD", "EOG", "HAL", "SLB", "BKR", "DVN", "COP", "XEC", "OXY",
    "APA", "FANG", "HES", "MRO", "CLR", "CXO", "MTDR", "XOM", "CVX", "PSX", "VLO", "MPC", "HFC",
    "DK", "BP", "RDS.A", "RDS.B", "TOT", "E", "COP", "OXY", "PXD", "EOG", "MRO", "HES", "APA",
    "FANG", "CLR", "CXO", "XEC", "MTDR", "DK", "HFC", "PSX", "VLO", "MPC", "XOM", "CVX", "BP",
    "RDS.A", "RDS.B", "TOT", "E", "ENB", "TRP", "KMI", "WMB", "OKE", "EPD", "ET", "MPLX", "PAA",
    "XEL", "NEE", "DUK", "SO", "AEP", "D", "EXC", "PEG", "PCG", "EIX", "PPL", "FE", "ED", "NRG",
    "AES", "CMS", "DTE", "ETR", "AEE", "WEC", "ES", "ATO", "NI", "CNP", "PNW", "OGE", "IDA"
]

# Define the start and end dates
end_date = datetime.datetime.now()
start_date = end_date - datetime.timedelta(days=35*365)

# Create an empty DataFrame to store the combined data
combined_data = pd.DataFrame()

# Loop through each ticker and download the data
for ticker in tickers:
    print(f"Downloading data for {ticker}...")
    stock_data = yf.download(ticker, start=start_date, end=end_date, interval="1d")
    stock_data["Ticker"] = ticker  # Add a column for the ticker
    combined_data = pd.concat([combined_data, stock_data])

# Save the combined data to a CSV file
output_file = "stock_data_last_35_years.csv"
combined_data.to_csv(output_file)
print(f"Data saved to {output_file}")

# Print the number of rows to ensure it meets the requirement
print(f"Total number of rows: {combined_data.shape[0]}")
