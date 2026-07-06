from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def get_database():
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGO_URI)
        db.db = db.client[settings.DATABASE_NAME]
    return db.db

async def get_collection(name: str):
    database = await get_database()
    return database[name]

async def close_mongo_connection():
    if db.client:
        db.client.close()
