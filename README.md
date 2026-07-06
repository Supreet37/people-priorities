# People's Priorities

A digital ledger for constituency development, connecting citizens directly with their Member of Parliament (MP).

## Tech Stack
- **Backend:** Python FastAPI, MongoDB (Motor), JWT Auth
- **Frontend:** React (Vite), Tailwind CSS, React Leaflet, Recharts
- **Design:** Custom "Ledger" design system with Fraunces & IBM Plex fonts

## Features
- **Citizen Portal:** Submit complaints (text/voice/photo), track status with ink-stamp badges, view MP schemes.
- **MP Dashboard:** AI-driven project rankings, constituency heatmap, submission management, scheme announcements.
- **AI Integration:** Automatic category suggestion and project prioritization.

## How to Run Locally

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Ensure MongoDB is running on localhost:27017
python -m backend.db.seed  # Seed initial demo accounts
uvicorn backend.main:app --reload
```

### 2. Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## Demo Accounts
- **MP:** mp@example.com / password123
- **Citizen:** citizen@example.com / password123
