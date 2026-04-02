from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import SignupRequest, LoginRequest, TokenResponse, UserResponse
from auth import hash_password, verify_password, create_access_token, get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_cors_headers(request: Request):
    origin = request.headers.get("origin", "http://localhost:5173")
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
    }


@router.post("/signup", status_code=201)
def signup(request: Request, req_dict: dict, db: Session = Depends(get_db)):
    try:
        # Bypassing Pydantic for input to check if it's the cause
        email = req_dict.get("email")
        name = req_dict.get("name")
        password = req_dict.get("password")
        
        if not email or not name or not password:
             return JSONResponse(status_code=400, content={"detail": "Missing fields", "error": "Signup failed validation"})

        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return JSONResponse(status_code=400, content={"detail": "Email already registered", "error": "Duplicate user"})

        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role="user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(data={"sub": user.id})
        
        # Manual Field Picking with Reload Marker
        user_data = {
            "reload_marker": "STABILITY_FIX_V3",
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "subscription_type": getattr(user, 'subscription_type', 'free'),
            "subscription_status": getattr(user, 'subscription_status', 'inactive'),
            "charity_id": getattr(user, 'charity_id', None),
            "charity_percentage": getattr(user, 'charity_percentage', 0.0),
            "created_at": user.created_at.isoformat() if hasattr(user.created_at, 'isoformat') else str(user.created_at)
        }

        return JSONResponse(
            status_code=201,
            content={
                "access_token": token,
                "token_type": "bearer",
                "user": user_data
            },
            headers=get_cors_headers(request)
        )
    except Exception as e:
        print(f"CRITICAL ERROR SIGNUP: {e}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Signup failed. Please try again.", "error": str(e)},
            headers=get_cors_headers(request)
        )


@router.post("/login")
def login(request: Request, req: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token(data={"sub": user.id})
        
        # Manual Field Picking to avoid any validation or serialization issues
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "subscription_type": getattr(user, 'subscription_type', 'free'),
            "subscription_status": getattr(user, 'subscription_status', 'inactive'),
            "charity_id": getattr(user, 'charity_id', None),
            "charity_percentage": getattr(user, 'charity_percentage', 0.0),
            "created_at": user.created_at.isoformat() if hasattr(user.created_at, 'isoformat') else str(user.created_at)
        }

        return JSONResponse(
            content={
                "access_token": token,
                "token_type": "bearer",
                "user": user_data
            },
            headers=get_cors_headers(request)
        )
    except HTTPException as he:
         raise he
    except Exception as e:
        print(f"CRITICAL ERROR LOGIN: {e}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Login failed. Please try again.", "error": str(e)},
            headers=get_cors_headers(request)
        )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
