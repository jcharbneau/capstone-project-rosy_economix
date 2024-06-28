from fastapi import APIRouter, HTTPException
import asyncpg
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)
DATABASE_URL = os.getenv('DATABASE_URL')

@router.get("/test-db-connection")
async def test_db_connection():
    try:
        connection = await asyncpg.connect(DATABASE_URL)
        await connection.close()
        return {"message": "Successfully connected to the database"}
    except Exception as e:
        logger.error(f"Failed to connect to the database: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to connect to the database: {e}")
