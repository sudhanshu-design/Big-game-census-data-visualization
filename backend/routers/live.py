from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import time

router = APIRouter(prefix="/ws", tags=["live"])

# Real-world demographic constants for India (Simulated Clock)
# Base reference: Jan 1, 2024
BASE_TIMESTAMP = 1704067200  
BASE_POPULATION = 1441719852

# Growth calculations based on ~0.92% annual growth
# Approx 1 birth every 1.2s, 1 death every 3.2s => Net growth ~0.4205 per second
GROWTH_RATE_PER_SECOND = 0.4205 

# We can also gently adjust literacy rate over time, e.g. +0.0000001 per second
BASE_LITERACY = 77.7 
LITERACY_GROWTH_PER_SECOND = 0.00000015

BASE_SEX_RATIO = 943
SEX_RATIO_GROWTH_PER_SECOND = 0.0000005

@router.websocket("/live-data")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            current_time = time.time()
            elapsed_seconds = current_time - BASE_TIMESTAMP
            
            # Since midnight logic
            start_of_day = int(current_time / 86400) * 86400
            seconds_today = current_time - start_of_day
            live_births_today = int(seconds_today * (1 / 1.2))
            live_deaths_today = int(seconds_today * (1 / 3.2))

            current_population = int(BASE_POPULATION + (elapsed_seconds * GROWTH_RATE_PER_SECOND))
            current_literacy = round(BASE_LITERACY + (elapsed_seconds * LITERACY_GROWTH_PER_SECOND), 4)
            current_sex_ratio = round(BASE_SEX_RATIO + (elapsed_seconds * SEX_RATIO_GROWTH_PER_SECOND), 2)
            
            # Send the live simulated data
            payload = {
                "total_population": current_population,
                "avg_literacy_rate": current_literacy,
                "sex_ratio": current_sex_ratio,
                "live_births_today": live_births_today,
                "live_deaths_today": live_deaths_today,
                "timestamp": current_time
            }
            
            await websocket.send_json(payload)
            
            # Sleep for 1 second before sending the next update
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        print("Client disconnected from live data stream")
