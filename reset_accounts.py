
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def full_reset():
    uri = "mongodb://hospital_user:Health123@ac-xsmnhj7-shard-00-00.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-01.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-02.iihhpoh.mongodb.net:27017/health_appointment?ssl=true&authSource=admin&retryWrites=true&w=majority"
    client = AsyncIOMotorClient(uri)
    db = client["health_appointment"]
    
    # 1. Update doctors: VERIFIED, Active, Available, and ensure they have a role in 'users'
    doctors = await db["doctors"].find({}).to_list(100)
    print(f"Checking {len(doctors)} doctors...")
    for doc in doctors:
        user_id = doc.get("user_id")
        if user_id:
            await db["users"].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"role": "doctor", "must_change_password": False, "is_active": True}}
            )
        # Also ensure doc record is verified
        await db["doctors"].update_one(
            {"_id": doc["_id"]},
            {"$set": {"verification_status": "VERIFIED", "is_verified": True, "available": True}}
        )
    
    # 2. Update Admin: Ensure role is admin
    admin = await db["users"].find_one({"email": "admin@hospital.com"})
    if admin:
        await db["users"].update_one(
            {"_id": admin["_id"]},
            {"$set": {"role": "admin", "must_change_password": False, "is_active": True}}
        )
        print("Admin user verified.")
    
    # 3. Update Patients: Ensure role is patient if not already doctor/admin
    res = await db["users"].update_many(
        {"role": {"$exists": False}},
        {"$set": {"role": "patient", "must_change_password": False, "is_active": True}}
    )
    print(f"Updated {res.modified_count} users without roles to patient.")
    
    print("Full account database reset complete.")

if __name__ == "__main__":
    asyncio.run(full_reset())
