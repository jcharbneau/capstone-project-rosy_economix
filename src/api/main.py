from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
import matplotlib.pyplot as plt
import io
from typing import List, Dict, Any, Optional

from datetime import datetime, timedelta
import asyncpg
from pydantic import BaseModel


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/pipelines"

class IndicatorData(BaseModel):
    date: str
    value: float

class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]

# Pydantic model for response
class GdpStockCorrelationData(BaseModel):
    quarter: str
    gdp_growth_rate: float
    avg_stock_return: float

class Financials(BaseModel):
    ticker: str
    companyName: str
    industry: str
    sector: str
    marketCap: float
    totalRevenue: float
    netIncome: float

class StockData(BaseModel):
    ticker: str
    chartData: ChartData
    financials: Financials
    offExchangeTrading: Dict[str, Any]
    insiderTrading: Dict[str, Any]
    senateTrading: List[Dict[str, Any]]

class EconomicIndicatorSeries(BaseModel):
    gdp: List[IndicatorData]
    cpi: List[IndicatorData]
    unemployment_rate: List[IndicatorData]
    avg_hourly_earnings: List[IndicatorData]
    avg_weekly_earnings: List[IndicatorData]
    employment_cost_index: List[IndicatorData]
    job_openings: List[IndicatorData]
    nonfarm_payrolls: List[IndicatorData]
    total_wages_and_salaries: List[IndicatorData]

class BailoutStimulusChartData(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, str]]

class BailoutStimulusData(BaseModel):
    chartData: BailoutStimulusChartData

class TickerPrice(BaseModel):
    symbol: str
    price: float


def default_start_date():
    return (datetime.now() - timedelta(days=1*365)).date()

def default_end_date():
    return datetime.now().date()

# Configure CORS
origins = [
    "http://localhost:5180",
    "http://localhost:3000",  # Add any other origins you need to allow
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_chart(data, title, ylabel):
    fig, ax = plt.subplots(figsize=(10, 6))

    y_offset = 0.85  # Higher up in the chart
    y_spacing = 0.05  # Spacing between each annotation

    print("title:{}".format(title))



    for key, value in data.items():
        years = value['years']
        amounts = value['amounts']
        labels = value['labels']
        color = value['color']

        ax.plot(years, amounts, label=key, marker='o', color=color)

        for i, txt in enumerate(labels):
            if 'stimulus' in key.lower():
                x_position = 0.55  # Move stimulus annotations to the right
            else:
                x_position = 0.05  # Move other annotations to the left
            print(key)
            ax.annotate(
                txt, xy=(x_position, y_offset - i * y_spacing), xycoords='axes fraction',
                textcoords='offset points', xytext=(5, 0), ha='left',
                color=color, fontsize=10, fontweight='bold',
                arrowprops=dict(arrowstyle="->", connectionstyle="arc3", color=color, lw=1.5)
            )

    ax.set_ylabel(ylabel, fontsize=14, fontweight='bold')
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=1)
    ax.set_facecolor('#f0f0f0')
    ax.legend(fontsize=14)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    return buf


@app.get("/combined-chart")
async def get_combined_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],  # in billion $
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        },
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],  # in billion $
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }

    buf = create_chart(data, 'US Economic Stimulus and Bailouts (1995-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/stimulus-chart")
async def get_stimulus_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],  # in billion $
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        }
    }

    buf = create_chart(data, 'US Economic Stimulus (1997-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/bailouts-chart")
async def get_bailouts_chart():
    data = {
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],  # in billion $
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }

    buf = create_chart(data, 'US Economic Bailouts (2001-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/test-db-connection")
async def test_db_connection():
    try:
        # Create a connection to the database
        connection = await asyncpg.connect(DATABASE_URL)
        # Close the connection
        await connection.close()
        return {"message": "Successfully connected to the database"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to the database: {e}")


@app.get("/economic-indicators", response_model=EconomicIndicatorSeries)
async def get_economic_indicators(
    start_date: Optional[str] = Query(default=str(default_start_date()), description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(default=str(default_end_date()), description="End date in YYYY-MM-DD format")
):
    try:
        # Parse the dates
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        # Create a connection to the database
        connection = await asyncpg.connect(DATABASE_URL)

        # Query to retrieve data from the agg_economic_indicators table within the specified date range
        query = """
        SELECT date,
               gdp_value,
               cpi_value,
               unemployment_rate,
               avg_hourly_earnings,
               avg_weekly_earnings,
               employment_cost_index,
               job_openings,
               nonfarm_payrolls,
               total_wages_and_salaries
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        """

        # Execute the query and fetch all results
        results = await connection.fetch(query, start_date, end_date)

        # Close the connection
        await connection.close()

        # Format the results for Chart.js
        def format_data(field):
            return [IndicatorData(date=str(record['date']), value=record[field] if record[field] is not None else 0) for record in results]

        economic_indicators = EconomicIndicatorSeries(
            gdp=format_data('gdp_value'),
            cpi=format_data('cpi_value'),
            unemployment_rate=format_data('unemployment_rate'),
            avg_hourly_earnings=format_data('avg_hourly_earnings'),
            avg_weekly_earnings=format_data('avg_weekly_earnings'),
            employment_cost_index=format_data('employment_cost_index'),
            job_openings=format_data('job_openings'),
            nonfarm_payrolls=format_data('nonfarm_payrolls'),
            total_wages_and_salaries=format_data('total_wages_and_salaries')
        )

        return economic_indicators

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")


async def fetch_data(query: str, params: tuple):
    connection = await asyncpg.connect(DATABASE_URL)
    try:
        results = await connection.fetch(query, *params)
    finally:
        await connection.close()
    return results

@app.get("/get_gdp", response_model=List[IndicatorData])
async def get_gdp(start_date: str = Query(default=default_start_date()), end_date: str = Query(default=default_end_date())):
    query = """
    SELECT date, gdp_value as value
    FROM agg_economic_indicators
    WHERE date BETWEEN $1 AND $2
    ORDER BY date
    """
    try:
        results = await fetch_data(query, (start_date, end_date))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/get_cpi", response_model=List[IndicatorData])
async def get_cpi(start_date: str = Query(default=default_start_date()), end_date: str = Query(default=default_end_date())):
    query = """
    SELECT date, cpi_value as value
    FROM agg_economic_indicators
    WHERE date BETWEEN $1 AND $2
    ORDER BY date
    """
    try:
        results = await fetch_data(query, (start_date, end_date))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/unemployment_rate", response_model=List[IndicatorData])
async def get_unemployment_rate(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, unemployment_rate as value
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/gdp", response_model=List[IndicatorData])
async def get_gdp(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, gdp_value as value
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/cpi", response_model=List[IndicatorData])
async def get_cpi(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, cpi_value as value
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")


@app.get("/get_gdp_cpi_ur", response_model=EconomicIndicatorSeries)
async def get_gdp_cpi_ur(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, gdp_value, cpi_value, unemployment_rate
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))

        gdp_data = [
            IndicatorData(
                date=str(record['date']),
                value=record['gdp_value'] if record['gdp_value'] is not None else 0
            ) for record in results
        ]
        cpi_data = [
            IndicatorData(
                date=str(record['date']),
                value=record['cpi_value'] if record['cpi_value'] is not None else 0
            ) for record in results
        ]
        unemployment_data = [
            IndicatorData(
                date=str(record['date']),
                value=record['unemployment_rate'] if record['unemployment_rate'] is not None else 0
            ) for record in results
        ]

        return EconomicIndicatorSeries(
            gdp=gdp_data,
            cpi=cpi_data,
            unemployment_rate=unemployment_data,
            avg_hourly_earnings=[],
            avg_weekly_earnings=[],
            employment_cost_index=[],
            job_openings=[],
            nonfarm_payrolls=[],
            total_wages_and_salaries=[]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/stock-data", response_model=StockData)
async def get_stock_data(ticker: str = "AAPL"):
    try:
        connection = await asyncpg.connect(DATABASE_URL)

        # Fetching chart data from stg_stock_data
        chart_data_query = """
        SELECT date, close as close_price
        FROM stg_stock_data
        WHERE ticker = $1
        ORDER BY date
        """
        chart_data_results = await connection.fetch(chart_data_query, ticker)
        chart_data = {
            "labels": [str(record["date"]) for record in chart_data_results],
            "datasets": [{
                "label": "Stock Price",
                "data": [record["close_price"] for record in chart_data_results],
                "borderWidth": "2",
                "borderColor": "rgba(75, 192, 192, 1)",
                "backgroundColor": "rgba(75, 192, 192, 0.2)"
            }]
        }

        # Fetching financial data from stock_financials
        financials_query = """
        SELECT ticker, company_name, industry, sector, market_cap, total_revenue, net_income
        FROM stock_financials
        WHERE ticker = $1
        """
        financials_result = await connection.fetchrow(financials_query, ticker)
        financials = {
            "ticker": financials_result["ticker"],
            "companyName": financials_result["company_name"],
            "industry": financials_result["industry"],
            "sector": financials_result["sector"],
            "marketCap": financials_result["market_cap"],
            "totalRevenue": financials_result["total_revenue"],
            "netIncome": financials_result["net_income"]
        }

        off_exchange_trading = {}
        insider_trading = {}
        senate_trading = []

        await connection.close()

        return StockData(
            ticker=ticker,
            chartData=chart_data,
            financials=financials,
            offExchangeTrading=off_exchange_trading,
            insiderTrading=insider_trading,
            senateTrading=senate_trading
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stock data: {e}")



@app.get("/api/bailout-stimulus", response_model=BailoutStimulusData)
async def get_bailout_stimulus_data():
    try:
        connection = await asyncpg.connect(DATABASE_URL)

        # Fetching chart data from stg_government_bailout_stimulus
        chart_data_query = """
        SELECT year, bailout_amount, stimulus_amount
        FROM stg_government_bailout_stimulus
        ORDER BY date
        """
        chart_data_results = await connection.fetch(chart_data_query)
        chart_data = {
            "labels": [str(record["date"]) for record in chart_data_results],
            "datasets": [
                {
                    "label": "Bailout Amount",
                    "data": [record["bailout_amount"] for record in chart_data_results],
                    "borderWidth": "2",
                    "borderColor": "rgba(75, 192, 192, 1)",
                    "backgroundColor": "rgba(75, 192, 192, 0.2)"
                },
                {
                    "label": "Stimulus Amount",
                    "data": [record["stimulus_amount"] for record in chart_data_results],
                    "borderWidth": "2",
                    "borderColor": "rgba(153, 102, 255, 1)",
                    "backgroundColor": "rgba(153, 102, 255, 0.2)"
                }
            ]
        }

        await connection.close()

        return BailoutStimulusData(chartData=chart_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bailout stimulus data: {e}")


@app.get("/api/gdp-stock-correlation", response_model=List[GdpStockCorrelationData])
async def get_gdp_stock_correlation():
    query = """
    SELECT quarter, gdp_growth_rate, avg_stock_return
    FROM final_stock_gdp_data
    ORDER BY quarter;
    """
    try:
        results = await fetch_data(query, ())
        # Filter out records where avg_stock_return is None
        data = [
            GdpStockCorrelationData(
                quarter=str(record['quarter']),
                gdp_growth_rate=record['gdp_growth_rate'],
                avg_stock_return=record['avg_stock_return'] if record['avg_stock_return'] is not None else 0.0  # Default to 0.0 if None
            )
            for record in results
            if record['avg_stock_return'] is not None
        ]
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

# Endpoint to get stock tickers and their latest prices
@app.get("/api/stock-tickers", response_model=List[TickerPrice])
async def get_stock_tickers():
    try:
        connection = await asyncpg.connect(DATABASE_URL)
        query = """
        SELECT ticker as symbol, close as price
        FROM (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) as rn
            FROM stg_stock_data
        ) sub
        WHERE rn = 1
        """
        results = await connection.fetch(query)
        await connection.close()

        return [TickerPrice(symbol=record['symbol'], price=record['price']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stock tickers: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
