
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check():
    uri = "mongodb://hospital_user:Health123@ac-xsmnhj7-shard-00-00.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-01.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-02.iihhpoh.mongodb.net:27017/health_appointment?ssl=true&authSource=admin&retryWrites=true&w=majority"
    client = AsyncIOMotorClient(uri)
    db = client["health_appointment"]
    
    print("--- USERS & DOCTOR STATUS ---")
    async for user in db["users"].find():
        print(f"User: {user.get('email')} | Role: {user.get('role')} | ID: {user['_id']}")
        if user.get("role") == "doctor":
            doc = await db["doctors"].find_one({"user_id": str(user["_id"])})
            if doc:
                print(f"  - Doctor Profile found: {doc.get('specialization')}, Status: {doc.get('verification_status')}")
            else:
                print(f"  - NO DOCTOR PROFILE for user {user.get('email')}")

if __name__ == "__main__":
    asyncio.run(check())
