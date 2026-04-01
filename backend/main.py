from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from config import FRONTEND_URL
from database import engine, Base
from routers import auth_router, score_router, charity_router, draw_router, winner_router, admin_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Golf Charity Subscription Platform", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include routers
app.include_router(auth_router.router)
app.include_router(score_router.router)
app.include_router(charity_router.router)
app.include_router(draw_router.router)
app.include_router(winner_router.router)
app.include_router(admin_router.router)


@app.get("/")
def root():
    return {"message": "Golf Charity Subscription Platform API", "version": "1.0.0"}
