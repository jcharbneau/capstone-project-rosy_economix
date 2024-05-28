import yfinance as yf

# List of stock tickers
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
    "DK", "BP", "RDS.A", "RDS.B", "TOT", "E", "ENB", "TRP", "KMI", "WMB", "OKE", "EPD", "ET", "MPLX", "PAA"
]

def get_company_info(tickers):
    """
    Given a list of stock tickers, return a dictionary mapping tickers to company info including name and industry.
    """
    company_info = {}
    for ticker in tickers:
        stock = yf.Ticker(ticker)
        info = stock.info
        name = info.get('longName', 'N/A')
        industry = info.get('industry', 'N/A')
        company_info[ticker] = {'name': name, 'industry': industry}
    return company_info

def format_company_info(company_info):
    """
    Format the company info similar to the FRED ID lookup output.
    """
    formatted_lines = ["Stock Ticker | Company Name                           | Industry"]
    formatted_lines.append("-" * 80)
    for ticker, info in company_info.items():
        name = info['name']
        industry = info['industry']
        formatted_lines.append(f"{ticker:<12} | {name:<40} | {industry}")
    return "\n".join(formatted_lines)

def save_company_info_to_file(formatted_data, filename='company_info.txt'):
    """
    Save the formatted company info to a file.
    """
    with open(filename, 'w') as f:
        f.write(formatted_data)

def main():
    """
    Main function to look up and print company info for a list of stock tickers.
    """
    company_info = get_company_info(tickers)
    formatted_data = format_company_info(company_info)
    print(formatted_data)
    # save_company_info_to_file(formatted_data)

if __name__ == "__main__":
    main()