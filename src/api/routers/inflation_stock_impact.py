from fastapi import APIRouter, Query, HTTPException
from typing import List
from datetime import datetime
from db import fetch_data
from models import InflationStockImpactData, StockSectorData
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/inflation-stock-impact", response_model=List[InflationStockImpactData])
async def get_inflation_stock_impact(
    start_date: str = Query(default=(datetime.now().replace(year=datetime.now().year - 5)).strftime("%Y-%m-%d")),
    end_date: str = Query(default=datetime.now().strftime("%Y-%m-%d"))
):
    inflation_query = """
    SELECT date, cpi_value AS inflation_rate
    FROM economic_indicators
    WHERE date BETWEEN $1 AND $2
    ORDER BY date
    """
    stock_query = """
    SELECT date, sector, stock_price
    FROM economic_indicators_with_sector
    WHERE date BETWEEN $1 AND $2
    ORDER BY date
    """
    try:
        inflation_results = await fetch_data(inflation_query, (start_date, end_date))
        stock_results = await fetch_data(stock_query, (start_date, end_date))

        stock_data_by_date = {}
        for record in stock_results:
            date_str = str(record['date'])
            if date_str not in stock_data_by_date:
                stock_data_by_date[date_str] = []
            stock_data_by_date[date_str].append(StockSectorData(
                date=date_str,
                sector=record['sector'],
                stock_price=record['stock_price']
            ))

        response_data = [
            InflationStockImpactData(
                date=str(record['date']),
                inflation_rate=record['inflation_rate'],
                stock_data=stock_data_by_date.get(date_str, [])
            )
            for record in inflation_results
        ]
        return response_data
    except Exception as e:
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")
