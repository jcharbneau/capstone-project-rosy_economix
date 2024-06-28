from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from utils import create_chart

router = APIRouter()

@router.get("/combined-chart")
async def get_combined_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        },
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }
    buf = create_chart(data, 'US Economic Stimulus and Bailouts (1995-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')
