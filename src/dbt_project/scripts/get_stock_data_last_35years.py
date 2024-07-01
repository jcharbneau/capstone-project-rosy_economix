import yfinance as yf
import pandas as pd
import datetime
import json
import sys
import time
from pprint import pprint

# Read tickers from JSON file
with open('scripts/tickers.json', 'r') as file:
    data = json.load(file)
    tickers = data['tickers']

def get_company_info_batch(ticker_batch):
    """Given a batch of stock tickers, return a dictionary mapping tickers to company info including name and industry."""
    company_info = {}
    for ticker in ticker_batch:
        try:
            print(f"Getting info for {ticker}")
            stock = yf.Ticker(ticker)
            info = stock.info
            name = info.get('longName', 'N/A')
            industry = info.get('industry', 'N/A')
            sector = info.get('sector', 'N/A')
            market_cap = info.get('marketCap', 0)
            total_revenue = info.get('totalRevenue', 0)
            net_income = info.get('netIncomeToCommon', 0)
            average_volume = info.get('averageVolume', 0)
            officer_pay = sum([officer.get('totalPay', 0) for officer in info.get('companyOfficers', [])])
            pe_ratio = info.get('trailingPE', 0)
            ps_ratio = info.get('priceToSalesTrailing12Months', 0)

            company_info[ticker] = {
                'name': name,
                'industry': industry,
                'sector': sector,
                'market_cap': market_cap,
                'total_revenue': total_revenue,
                'net_income': net_income,
                'average_volume': average_volume,
                'officer_pay': officer_pay,
                'pe_ratio': pe_ratio,
                'ps_ratio': ps_ratio
            }
            print(f"\t{company_info}")

        except Exception as e:
            print(f"Failed to get info for {ticker}: {e}")
    return company_info

def get_all_company_info(tickers, batch_size):
    """Get company info for all tickers in batches."""
    all_company_info = {}
    ticker_batches = [tickers[i:i + batch_size] for i in range(0, len(tickers), batch_size)]
    for batch in ticker_batches:
        batch_info = get_company_info_batch(batch)
        all_company_info.update(batch_info)
    return all_company_info

# Define the start and end dates
end_date = datetime.datetime.now()
start_date = end_date - datetime.timedelta(days=35*365)

# Start timing
start_time = time.time()

# Get company info in batches
company_info = get_all_company_info(tickers, batch_size=10)

# Requesting multiple tickers at once
batch_size = 10  # You can adjust the batch size
ticker_batches = [tickers[i:i + batch_size] for i in range(0, len(tickers), batch_size)]

# Create an empty DataFrame to store the combined data
combined_data = pd.DataFrame()

for batch in ticker_batches:
    try:
        print(f"Downloading data for batch: {batch}...")
        stock_data = yf.download(batch, start=start_date, end=end_date, interval="1d", group_by='ticker')

        for ticker in batch:
            ticker_data = stock_data[ticker].copy()
            ticker_data.reset_index(inplace=True)  # Ensure Date is a column

            # Ensure no missing columns by filling NAs
            ticker_data = ticker_data.assign(
                Open=ticker_data["Open"].fillna(0),
                High=ticker_data["High"].fillna(0),
                Low=ticker_data["Low"].fillna(0),
                Close=ticker_data["Close"].fillna(0),
                Adj_Close=ticker_data["Adj Close"].fillna(0),
                Volume=ticker_data["Volume"].fillna(0).astype(int)
            )

            ticker_data = ticker_data.assign(
                Ticker=ticker,
                Company_Name=company_info[ticker]['name'],
                Industry=company_info[ticker]['industry'],
                Sector=company_info[ticker]['sector'],
                Market_Cap=company_info[ticker]['market_cap'],
                Total_Revenue=company_info[ticker]['total_revenue'],
                Net_Income=company_info[ticker]['net_income'],
                Average_Volume=company_info[ticker]['average_volume'],
                Officer_Pay=company_info[ticker]['officer_pay'],
                PE_Ratio=company_info[ticker]['pe_ratio'],
                PS_Ratio=company_info[ticker]['ps_ratio']
            )

            combined_data = pd.concat([combined_data, ticker_data], ignore_index=True)
    except Exception as e:
        print(f"Failed to download data for batch {batch}: {e}")

# Save the combined data to a CSV file
output_file = "seeds/raw_stock_data.csv"
combined_data.to_csv(output_file, index=False)
print(f"Data saved to {output_file}")

# Print the number of rows to ensure it meets the requirement
print(f"Total number of rows: {combined_data.shape[0]}")

# End timing
end_time = time.time()
elapsed_time = end_time - start_time
print(f"Total elapsed time: {elapsed_time:.2f} seconds")
