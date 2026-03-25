import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000/api/v1"

async def test_recommend():
    async with httpx.AsyncClient(timeout=20.0) as client:
        # 1. Get doctors
        print("Fetching doctors...")
        resp = await client.get(f"{BASE_URL}/doctors/")
        if resp.status_code != 200:
            print(f"Error fetching doctors: {resp.status_code}")
            return
        doctors = resp.json()
        if not doctors or not isinstance(doctors, list):
            print("No doctors found or invalid response format!")
            return
        
        # Find our seeded doctor or any verified one
        target_doc = None
        for d in doctors:
            if d and d.get("verification_status") == "VERIFIED":
                target_doc = d
                break
        
        if not target_doc:
            target_doc = doctors[0]
            
        if not target_doc:
            print("Failed to identify a target doctor.")
            return

        d_id = target_doc.get("_id") or target_doc.get("id")
        if not d_id:
            print("Target doctor has no ID.")
            return

        print(f"Target Doctor: {target_doc.get('name', 'Unknown')} ({d_id})")
        
        # 2. Get locations for this doctor
        print(f"Fetching locations for {d_id}...")
        resp2 = await client.get(f"{BASE_URL}/doctors/{d_id}/locations")
        if resp2.status_code != 200:
            print(f"Error fetching locations: {resp2.status_code} - {resp2.text}")
            return
            
        locs = resp2.json()
        print(f"API Locations Response: {json.dumps(locs)}")
        
        if not locs:
            print("No locations found for this doctor!")
            return
            
        # The API returns a list of location objects (from doctor_schedule.py logic)
        # Each object has 'id', 'name', etc.
        target_loc = locs[0]
        loc_id = target_loc.get("id") or target_loc.get("_id")
        print(f"Target Location: {target_loc.get('name')} ({loc_id})")
        
        # 3. Test Recommendation Standalone
        print("\n--- Testing Standalone Recommendation ---")
        payload = {
            "doctor_id": str(d_id),
            "location_id": str(loc_id),
            "date": "2026-03-25",
            "symptoms": ["Chest Pain", "Shortness of breath"] # Should trigger EMERGENCY priority
        }
        
        resp3 = await client.post(f"{BASE_URL}/appointments/recommend", json=payload)
        print(f"Status: {resp3.status_code}")
        data = resp3.json()
        print("Recommendations Title:", data.get("message"))
        print(json.dumps(data, indent=2, default=str))

if __name__ == "__main__":
    asyncio.run(test_recommend())
