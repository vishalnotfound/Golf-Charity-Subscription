from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ── User ─────────────────────────────────────────
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    subscription_type: str
    subscription_status: str
    charity_id: Optional[int] = None
    charity_percentage: float
    created_at: datetime

    class Config:
        from_attributes = True


# ── Auth ─────────────────────────────────────────
class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserListResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    subscription_type: str
    subscription_status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Scores ───────────────────────────────────────
class ScoreCreate(BaseModel):
    score: int = Field(..., ge=1, le=45)
    date: datetime


class ScoreResponse(BaseModel):
    id: int
    score: int
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ── Charity ──────────────────────────────────────
class CharityResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = None

    class Config:
        from_attributes = True


class CharitySelectRequest(BaseModel):
    charity_id: int
    percentage: float = Field(..., ge=10.0, le=100.0)


# ── Subscription ─────────────────────────────────
class SubscriptionUpdate(BaseModel):
    subscription_type: str = Field(..., pattern="^(free|monthly|yearly)$")


# ── Draw ─────────────────────────────────────────
class DrawResponse(BaseModel):
    id: int
    numbers: list
    month: int
    year: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Winner ───────────────────────────────────────
class WinnerResponse(BaseModel):
    id: int
    user_id: int
    draw_id: int
    match_count: int
    proof_image: Optional[str] = None
    status: str
    created_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True


class WinnerStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|approved|paid)$")
