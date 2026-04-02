from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import SignupRequest, LoginRequest, TokenResponse, UserResponse
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    print(f"DEBUG: Signup request received for {req.email}")
    try:
        print("DEBUG: Querying existing user...")
        existing = db.query(User).filter(User.email == req.email).first()
        print(f"DEBUG: Query complete. Existing: {'yes' if existing else 'no'}")
        
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        print("DEBUG: Hashing password...")
        user = User(
            name=req.name,
            email=req.email,
            password_hash=hash_password(req.password),
            role="user",
        )
        print("DEBUG: Adding user to DB...")
        db.add(user)
        print("DEBUG: Committing user to DB...")
        db.commit()
        print("DEBUG: Refreshing user data...")
        db.refresh(user)

        print("DEBUG: Creating access token...")
        token = create_access_token(data={"sub": user.id})
        print("DEBUG: Signup successful!")
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
        )
    except Exception as e:
        print(f"DEBUG ERROR during signup: {e}")
        raise e


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
