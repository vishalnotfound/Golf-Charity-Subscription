from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # "user" or "admin"
    subscription_type = Column(String(20), default="free")  # "free", "monthly", "yearly"
    subscription_status = Column(String(20), default="inactive")  # "active", "inactive"
    charity_id = Column(Integer, ForeignKey("charities.id"), nullable=True)
    charity_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    scores = relationship("Score", back_populates="user", cascade="all, delete-orphan")
    charity = relationship("Charity", back_populates="users")
    winnings = relationship("Winner", back_populates="user")


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="scores")


class Charity(Base):
    __tablename__ = "charities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)

    users = relationship("User", back_populates="charity")


class Draw(Base):
    __tablename__ = "draws"

    id = Column(Integer, primary_key=True, index=True)
    numbers = Column(JSON, nullable=False)  # Array of 5 numbers
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    status = Column(String(20), default="completed")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    winners = relationship("Winner", back_populates="draw")


class Winner(Base):
    __tablename__ = "winners"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    draw_id = Column(Integer, ForeignKey("draws.id"), nullable=False)
    match_count = Column(Integer, nullable=False)
    proof_image = Column(String(500), nullable=True)
    status = Column(String(20), default="pending")  # "pending", "approved", "paid"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="winnings")
    draw = relationship("Draw", back_populates="winners")
