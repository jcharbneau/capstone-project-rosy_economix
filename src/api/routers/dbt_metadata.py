from fastapi import APIRouter, HTTPException
from db import fetch_data
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/get_dbt_metadata")
async def get_dbt_metadata():
    query = """
    SELECT dbt.name, dbt.dependency
    FROM public.dbt_models dbt
    ORDER BY dbt.name ASC
    """
    try:
        models = await fetch_data(query)
        nodes = [{"id": model["name"], "data": {"label": model["name"]}} for model in models]
        edges = [{"id": f'e{model["dependency"]}-{model["name"]}', "source": model["dependency"], "target": model["name"], "animated": True} for model in models if model["dependency"]]
        return {"nodes": nodes, "edges": edges}
    except Exception as e:
        logger.error(f"Error fetching metadata: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/get_design_tables")
async def get_tables():
    query = "SELECT DISTINCT name FROM public.dbt_models ORDER BY name ASC"
    try:
        result = await fetch_data(query)
        tables = [record['name'] for record in result]
        return {"tables": tables}
    except Exception as e:
        logger.error(f"Failed to retrieve tables: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tables: {e}")

@router.get("/get_table_fields")
async def get_table_fields(table_name: str):
    query = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1"
    try:
        result = await fetch_data(query, (table_name,))
        fields = [{"name": record['column_name'], "type": record['data_type']} for record in result]
        return {"fields": fields}
    except Exception as e:
        logger.error(f"Failed to retrieve table fields: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve table fields: {e}")
