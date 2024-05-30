import yfinance as yf
import pandas as pd
import datetime

# List of stock tickers
tickers = [
    "AAPL", "MSFT", "IBM", "GE", "KO", "JNJ", "XOM", "PG", "MCD", "WMT", "T", "MRK", "PFE", "CVX", "BA"
]
# tickers = [
#     "AAPL", "MSFT", "IBM", "GE", "KO", "JNJ", "XOM", "PG", "MCD", "WMT", "T", "MRK", "PFE", "CVX", "BA",
#     "PEP", "VZ", "V", "CSCO", "INTC", "WBA", "NKE", "DIS", "MMM", "HON", "AMGN", "CAT", "RTX", "GS",
#     "AXP", "LMT", "MO", "CMCSA", "DHR", "ORCL", "MDT", "GILD", "BMY", "COST", "TGT", "LOW", "HD",
#     "SBUX", "FDX", "UPS", "GM", "F", "TSLA", "NFLX", "NVDA", "ADBE", "QCOM", "AVGO", "TXN", "AMD",
#     "INTU", "AMAT", "MU", "LRCX", "KLAC", "HPQ", "DELL", "CSX", "UNP", "NSC", "KSU", "UAL", "DAL",
#     "AAL", "LUV", "JBLU", "SWA", "XEL", "NEE", "DUK", "SO", "AEP", "D", "EXC", "PEG", "PCG", "EIX",
#     "PPL", "FE", "ED", "NRG", "AES", "CMS", "DTE", "ETR", "AEE", "WEC", "ES", "ATO", "NI", "CNP",
#     "PNW", "OGE", "IDA", "ALB", "PXD", "EOG", "HAL", "SLB", "BKR", "DVN", "COP", "XEC", "OXY",
#     "APA", "FANG", "HES", "MRO", "CLR", "CXO", "MTDR", "XOM", "CVX", "PSX", "VLO", "MPC", "HFC",
#     "DK", "BP", "RDS.A", "RDS.B", "TOT", "E", "ENB", "TRP", "KMI", "WMB", "OKE", "EPD", "ET", "MPLX", "PAA"
# ]

def get_company_info(tickers):
    """Given a list of stock tickers, return a dictionary mapping tickers to company info including name and industry."""
    company_info = {}
    for ticker in tickers:
        stock = yf.Ticker(ticker)
        info = stock.info
        name = info.get('longName', 'N/A')
        industry = info.get('industry', 'N/A')
        sector = info.get('sector', 'N/A')
        market_cap = info.get('marketCap', 0)
        total_revenue = info.get('totalRevenue', 0)
        net_income = info.get('netIncome', 0)
        company_info[ticker] = {
            'name': name,
            'industry': industry,
            'sector': sector,
            'market_cap': market_cap,
            'total_revenue': total_revenue,
            'net_income': net_income
        }
    return company_info

# Define the start and end dates
end_date = datetime.datetime.now()
start_date = end_date - datetime.timedelta(days=35*365)

# Get company info
company_info = get_company_info(tickers)

# Create an empty DataFrame to store the combined data
combined_data = pd.DataFrame()

# Loop through each ticker and download the data
for ticker in tickers:
    print(f"Downloading data for {ticker}...")
    stock_data = yf.download(ticker, start=start_date, end=end_date, interval="1d")
    stock_data["Ticker"] = ticker  # Add a column for the ticker
    stock_data["Company Name"] = company_info[ticker]['name']
    stock_data["Industry"] = company_info[ticker]['industry']
    stock_data["Sector"] = company_info[ticker]['sector']
    stock_data["Market Cap"] = company_info[ticker]['market_cap']
    stock_data["Total Revenue"] = company_info[ticker]['total_revenue']
    stock_data["Net Income"] = company_info[ticker]['net_income']
    stock_data["Volume"] = stock_data["Volume"].fillna(0).astype(int)  # Ensure Volume is an integer
    stock_data.reset_index(inplace=True)  # Ensure Date is a column
    combined_data = pd.concat([combined_data, stock_data])

# Save the combined data to a CSV file
output_file = "seeds/raw_stock_data.csv"
combined_data.to_csv(output_file, index=False)
print(f"Data saved to {output_file}")

# Print the number of rows to ensure it meets the requirement
print(f"Total number of rows: {combined_data.shape[0]}")