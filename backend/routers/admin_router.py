from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, Charity, Winner
from schemas import UserListResponse, SubscriptionUpdate, UserResponse, AdminStatsResponse
from auth import require_admin, get_current_user
from typing import List

router = APIRouter(tags=["Admin"])


@router.get("/admin/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_users = db.query(User).filter(User.role == "user").count()
    active_subscribers = db.query(User).filter(User.subscription_status == "active").count()
    pending_winners = db.query(Winner).filter(Winner.status == "pending").count()
    total_charities = db.query(Charity).count()
    
    return {
        "total_users": total_users,
        "active_subscribers": active_subscribers,
        "pending_winners": pending_winners,
        "total_charities": total_charities
    }


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
