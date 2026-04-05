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


@router.post("/signup", response_model=TokenResponse, status_code=201)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=req.name,
        email=req.email,
        password_hash=hash_password(req.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer", "user": user}
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
