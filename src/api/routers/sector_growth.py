from fastapi import APIRouter, Query, HTTPException
from typing import List
from db import fetch_data
from models import SectorGrowthData
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/sector-growth-last-decade", response_model=List[SectorGrowthData])
async def get_sector_growth_last_decade(
    start_date: str = Query(default=(datetime.now().replace(year=datetime.now().year - 35)).strftime("%Y-%m-%d")),
    end_date: str = Query(default=datetime.now().strftime("%Y-%m-%d"))
):
    query = """
    SELECT date, sector, growth_percentage
    FROM sector_growth_last_decade
    WHERE date BETWEEN $1 AND $2
    ORDER BY date, sector
    """
    try:
        results = await fetch_data(query, (start_date, end_date))
        response_data = [
            SectorGrowthData(
                date=str(record['date']),
                sector=record['sector'],
                growth_percentage=record['growth_percentage']
            ) for record in results
        ]
        return response_data
    except Exception as e:
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")
