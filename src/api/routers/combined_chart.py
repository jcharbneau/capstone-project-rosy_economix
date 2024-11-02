from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from utils import create_chart
from typing import AsyncGenerator
import json
import asyncio


router = APIRouter()


async def initial_data_stream() -> AsyncGenerator[str, None]:
    data = [
        {"year": 1997, "event": "Taxpayer Relief Act", "amount": 95},
        {"year": 2001, "event": "Economic Growth and Tax Relief Reconciliation Act", "amount": 120},
        {"year": 2008, "event": "Economic Stimulus Act", "amount": 152}
    ]
    for entry in data:
        yield json.dumps(entry) + "\n"  # JSON-encoded each data entry
        await asyncio.sleep(0.2)  # Brief delay to simulate stream


@router.get("/combined-chart-initial")
async def get_combined_chart_initial():
    return StreamingResponse(initial_data_stream(), media_type="application/json")


@router.websocket("/combined-chart-stream-ws")
async def websocket_combined_chart_stream(websocket: WebSocket):
    await websocket.accept()
    data = [
        {"year": 2022, "event": "New Stimulus", "amount": 150},
        {"year": 2023, "event": "Ongoing Recovery Program", "amount": 300},
    ]
    try:
        while True:
            for entry in data:
                await websocket.send_json(entry)
                await asyncio.sleep(5)  # Send data every 5 seconds
    except WebSocketDisconnect:
        print("Client disconnected")


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


async def chunked_data_stream() -> AsyncGenerator[str, None]:
    data = [
        {"year": 1997, "event": "Taxpayer Relief Act", "amount": 95},
        {"year": 2001, "event": "Economic Growth and Tax Relief Reconciliation Act", "amount": 120},
        {"year": 2008, "event": "Economic Stimulus Act", "amount": 152}
    ]

    for entry in data:
        yield json.dumps(entry)
        await asyncio.sleep(1)


@router.get("/combined-chart-stream")
async def get_combined_chart_stream():
    return StreamingResponse(chunked_data_stream(), media_type="application/json")
