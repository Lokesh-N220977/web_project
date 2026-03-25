import httpx
import asyncio

async def get_error():
    async with httpx.AsyncClient() as client:
        resp = await client.get("http://localhost:8000/api/v1/doctors/")
        d_id = resp.json()[0]["_id"]
        print(f"Testing ID: {d_id}")
        resp2 = await client.get(f"http://localhost:8000/api/v1/doctors/{d_id}/locations")
        print(f"Status: {resp2.status_code}")
        print(f"Body: {resp2.text}")

asyncio.run(get_error())
