from fastapi import APIRouter, Query, HTTPException
from typing import List
from db import fetch_data
from models import StockData, TickerPrice, IndicatorData, GdpStockCorrelationData
from datetime import datetime
import logging
import asyncpg
import os
router = APIRouter()
logger = logging.getLogger(__name__)
DATABASE_URL = os.getenv('DATABASE_URL')

@router.get("/stock-data", response_model=StockData)
async def get_stock_data(ticker: str = "AAPL"):
    try:
        connection = await asyncpg.connect(DATABASE_URL)

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
        logger.error(f"Failed to retrieve stock data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stock data: {e}")

@router.get("/gdp-stock-correlation", response_model=List[GdpStockCorrelationData])
async def get_gdp_stock_correlation(
    start_date: str = Query(default=datetime(1970, 1, 1)),
    end_date: str = Query(default=datetime.now())
):
    query = """
    SELECT quarter, gdp_growth_rate, avg_stock_return
    FROM final_stock_gdp_data
    WHERE quarter BETWEEN $1 AND $2
    ORDER BY quarter
    """
    try:
        results = await fetch_data(query, (start_date, end_date))
        data = [
            GdpStockCorrelationData(
                quarter=str(record['quarter']),
                gdp_growth_rate=record['gdp_growth_rate'],
                avg_stock_return=record['avg_stock_return'] if record['avg_stock_return'] is not None else 0.0
            )
            for record in results
            if record['avg_stock_return'] is not None
        ]
        return data
    except Exception as e:
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@router.get("/stock-tickers", response_model=List[TickerPrice])
async def get_stock_tickers():
    query = """
    SELECT ticker as symbol, close as price
    FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY ticker ORDER BY date DESC) as rn
        FROM stg_stock_data
    ) sub
    WHERE rn = 1
    ORDER BY ticker ASC
    """
    try:
        results = await fetch_data(query)
        return [TickerPrice(symbol=record['symbol'], price=record['price']) for record in results]
    except Exception as e:
        logger.error(f"Failed to retrieve stock tickers: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stock tickers: {e}")
