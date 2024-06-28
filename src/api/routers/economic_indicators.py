from fastapi import APIRouter, Query, HTTPException
from datetime import datetime
from typing import Optional, List
from db import fetch_data
from models import EconomicIndicatorSeries, IndicatorData
from utils import default_start_date, default_end_date, thirty_five_years_ago
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/economic-indicators", response_model=EconomicIndicatorSeries)
async def get_economic_indicators(
    start_date: Optional[str] = Query(default=str(default_start_date()), description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(default=str(default_end_date()), description="End date in YYYY-MM-DD format")
):
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, gdp_value, cpi_value, unemployment_rate, avg_hourly_earnings,
               avg_weekly_earnings, employment_cost_index, job_openings, nonfarm_payrolls,
               total_wages_and_salaries
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        """
        results = await fetch_data(query, (start_date, end_date))

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
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@router.get("/get_gdp", response_model=List[IndicatorData])
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
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@router.get("/get_cpi", response_model=List[IndicatorData])
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
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@router.get("/unemployment_rate", response_model=List[IndicatorData])
async def get_unemployment_rate(
    start_date: str = Query(default=thirty_five_years_ago().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    query = """
    SELECT date, unemployment_rate as value
    FROM agg_economic_indicators
    WHERE date BETWEEN $1 AND $2
    ORDER BY date
    """
    try:
        results = await fetch_data(query, (start_date, end_date))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@router.get("/get_gdp_cpi_ur", response_model=EconomicIndicatorSeries)
async def get_gdp_cpi_ur(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    query = """
    SELECT date, gdp_value, cpi_value, unemployment_rate
    FROM agg_economic_indicators
    WHERE date BETWEEN $1 AND $2
    ORDER BY date ASC
    """
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")

        results = await fetch_data(query, (start_date, end_date))
        gdp_data = [IndicatorData(date=str(record['date']), value=record['gdp_value'] if record['gdp_value'] is not None else 0) for record in results]
        cpi_data = [IndicatorData(date=str(record['date']), value=record['cpi_value'] if record['cpi_value'] is not None else 0) for record in results]
        unemployment_data = [IndicatorData(date=str(record['date']), value=record['unemployment_rate'] if record['unemployment_rate'] is not None else 0) for record in results]

        return EconomicIndicatorSeries(
            gdp=gdp_data,
            cpi=cpi_data,
            unemployment_rate=unemployment_data
        )
    except Exception as e:
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")
