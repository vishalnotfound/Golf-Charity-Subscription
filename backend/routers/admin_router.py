from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserListResponse, SubscriptionUpdate, UserResponse
from auth import require_admin, get_current_user
from typing import List

router = APIRouter(tags=["Admin"])


@router.get("/admin/users", response_model=List[UserListResponse])
def list_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.put("/subscription", response_model=UserResponse)
def update_subscription(
    req: SubscriptionUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user.subscription_type = req.subscription_type
    user.subscription_status = "active" if req.subscription_type != "free" else "inactive"
    db.commit()
    db.refresh(user)
    return user
