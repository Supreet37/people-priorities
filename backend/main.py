from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from .routers import auth, citizen_submissions, uploads, mp_submissions, dashboard, map, schemes, reports
from .db.mongo import close_mongo_connection

app = FastAPI(title="People's Priorities API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded voice/photo files locally
UPLOADS_DIR = Path(__file__).resolve().parent / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.include_router(auth.router)
app.include_router(citizen_submissions.router)
app.include_router(uploads.router)
app.include_router(mp_submissions.router)
app.include_router(dashboard.router)
app.include_router(map.router)
app.include_router(schemes.router)
app.include_router(reports.router)

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to People's Priorities API"}