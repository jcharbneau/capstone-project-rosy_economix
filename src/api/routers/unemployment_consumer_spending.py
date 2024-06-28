from fastapi import APIRouter, Query, HTTPException
from typing import List
from db import fetch_data
from models import UnemploymentConsumerSpendingData
from utils import default_start_date, default_end_date
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/unemployment-consumer-spending", response_model=List[UnemploymentConsumerSpendingData])
async def get_unemployment_consumer_spending(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    query = """
    SELECT date, unemployment_rate, consumer_spending
    FROM economic_indicators
    WHERE date BETWEEN $1 AND $2 AND unemployment_rate is not null
    ORDER BY date
    """
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")

        results = await fetch_data(query, (start_date, end_date))
        return [
            UnemploymentConsumerSpendingData(
                date=record['date'].strftime('%Y-%m-%d'),
                unemployment_rate=record['unemployment_rate'],
                consumer_spending=record['consumer_spending']
            )
            for record in results
        ]
    except Exception as e:
        logger.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")
