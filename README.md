# Golf Charity Subscription Platform

MVP full-stack web application designed for a 2-day coding challenge.

## Features

- **Authentication**: JWT-based auth with user and admin roles.
- **Subscription**: Mock tiered subscription plans restricting platform capabilities.
- **Score Management**: Add scores (1-45). Tracks the latest 5 active scores, automatically deleting the oldest when a 6th is added.
- **Charity Support**: Browse and select charities, allocating a percentage.
- **Monthly Draw**: Admin can trigger a draw producing 5 random numbers. Automatically checks against all active users' latest scores to calculate match tiers.
- **Winnings**: View draw wins and upload proof images for admin approval.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router, Lucide Icons.
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite (local config ready for PostgreSQL), JWT, Passlib.

## Running Locally

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

# Seed the database (creates admin@golf.com / admin123 and sample charities)
python seed.py

# Run the API server
uvicorn main:app --reload --port 8000
```

*API Documentation available at: http://localhost:8000/docs*

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

*Frontend available at: http://localhost:5173*
