import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import load_environment

from routers import (
    combined_chart,
    stimulus_chart,
    bailouts_chart,
    db_connection,
    dbt_metadata,
    unemployment_consumer_spending,
    inflation_stock_impact,
    sector_growth,
    jobs_data,
    stock_data,
    upload_chart,
    economic_indicators
)

load_environment()

DATABASE_URL = os.getenv('DATABASE_URL')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/tmp/fastapi_debug.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(combined_chart.router, prefix="/api")
app.include_router(stimulus_chart.router, prefix="/api")
app.include_router(bailouts_chart.router, prefix="/api")
app.include_router(db_connection.router, prefix="/api")
app.include_router(dbt_metadata.router, prefix="/api")
app.include_router(unemployment_consumer_spending.router, prefix="/api")
app.include_router(inflation_stock_impact.router, prefix="/api")
app.include_router(sector_growth.router, prefix="/api")
app.include_router(jobs_data.router, prefix="/api")
app.include_router(stock_data.router, prefix="/api")
app.include_router(upload_chart.router, prefix="/api")
app.include_router(economic_indicators.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
