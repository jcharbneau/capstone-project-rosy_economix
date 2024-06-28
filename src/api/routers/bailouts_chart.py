from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from utils import create_chart

router = APIRouter()

@router.get("/bailouts-chart")
async def get_bailouts_chart():
    data = {
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
    buf = create_chart(data, 'US Economic Bailouts (2001-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')
