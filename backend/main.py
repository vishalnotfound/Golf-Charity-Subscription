from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from config import FRONTEND_URL
from database import engine, Base
from routers import auth_router, score_router, charity_router, draw_router, winner_router, admin_router

# Create tables
Base.metadata.create_all(bind=engine)

print("--- BACKEND SERVER INITIALIZING/RELOADING ---")

app = FastAPI(title="Golf Charity Subscription Platform", version="1.0.0")

# CORS Configuration
origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://[::1]:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://[::1]:5174",
]

# Add variants with trailing slashes
origins = origins + [o + "/" for o in origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Custom Logging Middleware for debugging CORS/Origins
@app.middleware("http")
async def log_origin_middleware(request: Request, call_next):
    origin = request.headers.get("origin")
    print(f"Incoming Request: {request.method} {request.url.path} from Origin: {origin}")
    response = await call_next(request)
    return response

# Custom Exception Handler to ensure CORS headers on error
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    allow_origin = origin if origin in origins else origins[0]
    
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
        headers={
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Credentials": "true",
        }
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


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": "2026-04-02T12:29:41Z", "note": "Reload Verification"}


