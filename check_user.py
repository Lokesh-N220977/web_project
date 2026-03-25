
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check():
    uri = "mongodb://hospital_user:Health123@ac-xsmnhj7-shard-00-00.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-01.iihhpoh.mongodb.net:27017,ac-xsmnhj7-shard-00-02.iihhpoh.mongodb.net:27017/health_appointment?ssl=true&authSource=admin&retryWrites=true&w=majority"
    client = AsyncIOMotorClient(uri)
    db = client["health_appointment"]
    
    user = await db["users"].find_one({"name": "Rahul Sharma"})
    if user:
        print(f"User: {user.get('name')}")
        print(f"Must Change Password: {user.get('must_change_password')}")
        print(f"Role: {user.get('role')}")
    else:
        print("User not found.")

if __name__ == "__main__":
    asyncio.run(check())
