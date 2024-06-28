import asyncpg
from fastapi import HTTPException
import os

DATABASE_URL = os.getenv('DATABASE_URL')

async def fetch_data(query: str, params: tuple = ()):
    connection = await asyncpg.connect(DATABASE_URL)
    try:
        results = await connection.fetch(query, *params)
    finally:
        await connection.close()
    return results

async def test_db_connection():
    try:
        connection = await asyncpg.connect(DATABASE_URL)
        await connection.close()
        return {"message": "Successfully connected to the database"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to the database: {e}")
