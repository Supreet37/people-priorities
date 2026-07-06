import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
from ..core.security import get_password_hash
from datetime import datetime

async def seed_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    # Clear collections
    await db.users.delete_many({})
    await db.submissions.delete_many({})
    
    # Seed MP
    mp_user = {
        "name": "Demo MP",
        "email": "mp@example.com",
        "password_hash": get_password_hash("password123"),
        "role": "mp",
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(mp_user)
    
    # Seed Citizen
    citizen_user = {
        "name": "John Doe",
        "email": "citizen@example.com",
        "password_hash": get_password_hash("password123"),
        "role": "citizen",
        "ward": "Ward 1",
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(citizen_user)
    
    print("Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_db())
