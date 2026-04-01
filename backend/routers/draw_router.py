import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Draw, Winner, User, Score
from schemas import DrawResponse
from auth import require_admin, get_current_user

router = APIRouter(tags=["Draw"])


@router.post("/draw/run", response_model=DrawResponse)
def run_draw(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    now = datetime.now(timezone.utc)
    month = now.month
    year = now.year

    # Generate 5 random numbers between 1 and 45
    draw_numbers = sorted(random.sample(range(1, 46), 5))

    draw = Draw(numbers=draw_numbers, month=month, year=year, status="completed")
    db.add(draw)
    db.commit()
    db.refresh(draw)

    # Get all active subscribers
    active_users = (
        db.query(User)
        .filter(User.subscription_status == "active", User.role == "user")
        .all()
    )

    for user in active_users:
        # Get user's latest 5 scores
        user_scores = (
            db.query(Score)
            .filter(Score.user_id == user.id)
            .order_by(Score.date.desc())
            .limit(5)
            .all()
        )
        if not user_scores:
            continue

        score_values = [s.score for s in user_scores]
        # Count matches
        matches = len(set(score_values) & set(draw_numbers))

        if matches >= 3:
            winner = Winner(
                user_id=user.id,
                draw_id=draw.id,
                match_count=matches,
                status="pending",
            )
            db.add(winner)

    db.commit()
    return draw


@router.get("/draw/latest", response_model=DrawResponse)
def get_latest_draw(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    draw = db.query(Draw).order_by(Draw.created_at.desc()).first()
    if not draw:
        raise HTTPException(status_code=404, detail="No draws found")
    return draw
