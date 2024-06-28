from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import ValidationError
from db import fetch_data
from models import JobsAnalysis
import logging

router = APIRouter()

@router.get("/jobs_data", response_model=List[JobsAnalysis])
async def get_jobs_data():
    query = """
    SELECT date, labor_force_participation_rate, discouraged_workers, 
           marginally_attached_workers, underemployment_rate
    FROM jobs_analysis
    ORDER BY date
    """
    try:
        data = await fetch_data(query)
        if not data:
            raise HTTPException(status_code=404, detail="Jobs data not found")

       # print(f"testing:${row['date'].strftime('%Y-%m-%d')}")

        return [JobsAnalysis(date=row['date'].strftime('%Y-%m-%d'),
                             labor_force_participation_rate=row['labor_force_participation_rate'],
                             discouraged_workers=row['discouraged_workers'],
                             marginally_attached_workers=row['marginally_attached_workers'],
                             underemployment_rate=row['underemployment_rate']) for row in data]
    except ValidationError as e:
        logging.error(f"Data validation error: {e}")
        raise HTTPException(status_code=422, detail=f"Data validation error: {e}")
    except Exception as e:
        logging.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")
