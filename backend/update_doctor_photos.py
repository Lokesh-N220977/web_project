from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from bson import ObjectId

async def update_docs():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DATABASE_NAME")
    
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    # List of doctors to update (Top 4 common ones in landing)
    # We'll just update ALL doctors with generic photos if they don't have one
    # or rotating through doc1-doc4
    
    docs = await db.doctors.find().to_list(100)
    
    photo_map = {
        "Prakash Nair": "/uploads/doctor_profiles/doc1.png",
        "Rajesh Pillai": "/uploads/doctor_profiles/doc3.png",
        "Ravi Shankar": "/uploads/doctor_profiles/doc4.png", # Wait Ravi is male, doc4 is female. Let's fix.
    }
    
    # Let's just do a simple rotation
    photos = [
        "/uploads/doctor_profiles/doc1.png",
        "/uploads/doctor_profiles/doc3.png",
        "/uploads/doctor_profiles/doc2.png", # Female
        "/uploads/doctor_profiles/doc4.png"  # Female
    ]
    
    for i, doc in enumerate(docs):
        photo = photos[i % len(photos)]
        # Match Gender roughly by name if common
        name = doc.get("name", "").lower()
        if "priya" in name or "anitha" in name or "lakshmi" in name:
            photo = "/uploads/doctor_profiles/doc2.png"
        elif "rajesh" in name or "prakash" in name or "ravi" in name:
            photo = "/uploads/doctor_profiles/doc1.png"
            
        await db.doctors.update_one(
            {"_id": doc["_id"]},
            {"$set": {"profile_image_url": photo, "avatar": photo}}
        )
        print(f"Updated {doc.get('name')} with {photo}")

if __name__ == "__main__":
    asyncio.run(update_docs())
