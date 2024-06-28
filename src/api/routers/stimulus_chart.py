from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from utils import create_chart

router = APIRouter()

@router.get("/stimulus-chart")
async def get_stimulus_chart():
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
        }
    }
    buf = create_chart(data, 'US Economic Stimulus (1997-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')
