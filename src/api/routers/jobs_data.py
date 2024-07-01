from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import ValidationError
from db import fetch_data
from models import JobsAnalysis
import pandas as pd
import logging

router = APIRouter()

@router.get("/jobs_data", response_model=List[JobsAnalysis])
async def get_jobs_data():
    query = """
    SELECT date, labor_force_participation_rate, discouraged_workers, 
           marginally_attached_workers, underemployment_rate, 
           federal_funds_rate, year_treasury_rate, job_openings, unemployment_rate
    FROM jobs_analysis
    WHERE date >= '1994-01-01'
    ORDER BY date
    """
    try:
        data = await fetch_data(query)
        if not data:
            raise HTTPException(status_code=404, detail="Jobs data not found")

        # Create DataFrame and dynamically set column names
        df = pd.DataFrame(data)
        if not df.empty:
            df.columns = data[0].keys()

        # Interpolate year_treasury_rate and fill NaN values
        df['year_treasury_rate'] = df['year_treasury_rate'].interpolate(
            method='linear', limit_direction='both').fillna(0)

        return [JobsAnalysis(
            date=row['date'].strftime('%Y-%m-%d'),
            labor_force_participation_rate=row['labor_force_participation_rate'],
            discouraged_workers=row['discouraged_workers'],
            marginally_attached_workers=row['marginally_attached_workers'],
            underemployment_rate=row['underemployment_rate'],
            federal_funds_rate=row['federal_funds_rate'],
            year_treasury_rate=row['year_treasury_rate'],
            job_openings=row['job_openings'],
            unemployment_rate=row['unemployment_rate']
        ) for row in df.to_dict('records')]

    except ValidationError as e:
        logging.error(f"Data validation error: {e}")
        raise HTTPException(status_code=422, detail=f"Data validation error: {e}")
    except Exception as e:
        logging.error(f"Failed to retrieve data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")
