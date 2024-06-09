from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import StreamingResponse
import matplotlib.pyplot as plt
import io
import os

from datetime import datetime, timedelta
import asyncpg
from pydantic import BaseModel
from typing import List, Optional


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/pipelines"

class IndicatorData(BaseModel):
    date: str
    value: float

class EconomicIndicatorSeries(BaseModel):
    gdp: List[IndicatorData]
    cpi: List[IndicatorData]
    unemployment_rate: List[IndicatorData]
    avg_hourly_earnings: List[IndicatorData]
    avg_weekly_earnings: List[IndicatorData]
    employment_cost_index: List[IndicatorData]
    job_openings: List[IndicatorData]
    nonfarm_payrolls: List[IndicatorData]
    total_wages_and_salaries: List[IndicatorData]

def default_start_date():
    return (datetime.now() - timedelta(days=1*365)).date()

def default_end_date():
    return datetime.now().date()

# Configure CORS
origins = [
    "http://localhost:5180",
    "http://localhost:3000",  # Add any other origins you need to allow
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_chart(data, title, ylabel):
    fig, ax = plt.subplots(figsize=(10, 6))

    y_offset = 0.85  # Higher up in the chart
    y_spacing = 0.05  # Spacing between each annotation

    print("title:{}".format(title))



    for key, value in data.items():
        years = value['years']
        amounts = value['amounts']
        labels = value['labels']
        color = value['color']

        ax.plot(years, amounts, label=key, marker='o', color=color)

        for i, txt in enumerate(labels):
            if 'stimulus' in key.lower():
                x_position = 0.55  # Move stimulus annotations to the right
            else:
                x_position = 0.05  # Move other annotations to the left
            print(key)
            ax.annotate(
                txt, xy=(x_position, y_offset - i * y_spacing), xycoords='axes fraction',
                textcoords='offset points', xytext=(5, 0), ha='left',
                color=color, fontsize=10, fontweight='bold',
                arrowprops=dict(arrowstyle="->", connectionstyle="arc3", color=color, lw=1.5)
            )

    ax.set_ylabel(ylabel, fontsize=14, fontweight='bold')
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=1)
    ax.set_facecolor('#f0f0f0')
    ax.legend(fontsize=14)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    return buf


@app.get("/combined-chart")
async def get_combined_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],  # in billion $
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        },
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],  # in billion $
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }

    buf = create_chart(data, 'US Economic Stimulus and Bailouts (1995-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/stimulus-chart")
async def get_stimulus_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],  # in billion $
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        }
    }

    buf = create_chart(data, 'US Economic Stimulus (1997-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/bailouts-chart")
async def get_bailouts_chart():
    data = {
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],  # in billion $
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }

    buf = create_chart(data, 'US Economic Bailouts (2001-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/test-db-connection")
async def test_db_connection():
    try:
        # Create a connection to the database
        connection = await asyncpg.connect(DATABASE_URL)
        # Close the connection
        await connection.close()
        return {"message": "Successfully connected to the database"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to the database: {e}")


@app.get("/economic-indicators", response_model=EconomicIndicatorSeries)
async def get_economic_indicators(
    start_date: Optional[str] = Query(default=str(default_start_date()), description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(default=str(default_end_date()), description="End date in YYYY-MM-DD format")
):
    try:
        # Parse the dates
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        # Create a connection to the database
        connection = await asyncpg.connect(DATABASE_URL)

        # Query to retrieve data from the agg_economic_indicators table within the specified date range
        query = """
        SELECT date,
               gdp_value,
               cpi_value,
               unemployment_rate,
               avg_hourly_earnings,
               avg_weekly_earnings,
               employment_cost_index,
               job_openings,
               nonfarm_payrolls,
               total_wages_and_salaries
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        """

        # Execute the query and fetch all results
        results = await connection.fetch(query, start_date, end_date)

        # Close the connection
        await connection.close()

        # Format the results for Chart.js
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
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")


async def fetch_data(query: str, params: tuple):
    connection = await asyncpg.connect(DATABASE_URL)
    try:
        results = await connection.fetch(query, *params)
    finally:
        await connection.close()
    return results

@app.get("/get_gdp", response_model=List[IndicatorData])
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
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/get_cpi", response_model=List[IndicatorData])
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
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/unemployment_rate", response_model=List[IndicatorData])
async def get_unemployment_rate(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, unemployment_rate as value
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/gdp", response_model=List[IndicatorData])
async def get_gdp(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, gdp_value as value
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")

@app.get("/api/cpi", response_model=List[IndicatorData])
async def get_cpi(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, cpi_value as value
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))
        return [IndicatorData(date=str(record['date']), value=record['value']) for record in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")


@app.get("/get_gdp_cpi_ur", response_model=EconomicIndicatorSeries)
async def get_gdp_cpi_ur(
    start_date: str = Query(default=default_start_date().strftime("%Y-%m-%d")),
    end_date: str = Query(default=default_end_date().strftime("%Y-%m-%d"))
):
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()

        query = """
        SELECT date, gdp_value, cpi_value, unemployment_rate
        FROM agg_economic_indicators
        WHERE date BETWEEN $1 AND $2
        ORDER BY date
        """
        results = await fetch_data(query, (start_date_obj, end_date_obj))

        gdp_data = [IndicatorData(date=str(record['date']), value=record['gdp_value']) for record in results]
        cpi_data = [IndicatorData(date=str(record['date']), value=record['cpi_value']) for record in results]
        unemployment_data = [IndicatorData(date=str(record['date']), value=record['unemployment_rate']) for record in results]

        return EconomicIndicatorSeries(
            gdp=gdp_data,
            cpi=cpi_data,
            unemployment_rate=unemployment_data,
            avg_hourly_earnings=[],
            avg_weekly_earnings=[],
            employment_cost_index=[],
            job_openings=[],
            nonfarm_payrolls=[],
            total_wages_and_salaries=[]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
