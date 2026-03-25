
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

async def check():
    uri = "mongodb://hospital_user:Health123@ac-xsmnhj7-shard-00-00.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-01.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-02.iihhpoh.mongodb.net:27017/health_appointment?ssl=true&authSource=admin&retryWrites=true&w=majority"
    client = AsyncIOMotorClient(uri)
    db = client["health_appointment"]
    
    users = await db["users"].find().to_list(100)
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"User: {u.get('email') or u.get('phone')} | Role: '{u.get('role')}' | Active: {u.get('is_active')} | MustChange: {u.get('must_change_password')}")
        if u.get('role') == 'doctor':
            doc = await db["doctors"].find_one({"user_id": str(u["_id"])})
            if doc:
                print(f"  -> Doctor Doc: {doc.get('name')}, Status: {doc.get('verification_status')}, Available: {doc.get('available')}")
            else:
                print(f"  -> MISSING DOCTOR DOC for user {u['_id']}")

if __name__ == "__main__":
    asyncio.run(check())
