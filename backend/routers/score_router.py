from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Score
from schemas import ScoreCreate, ScoreResponse
from auth import get_current_user
from typing import List

router = APIRouter(tags=["Scores"])


@router.post("/scores", response_model=ScoreResponse)
def add_score(req: ScoreCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.subscription_status != "active":
        raise HTTPException(status_code=403, detail="Active subscription required to add scores")

    # Get current scores ordered by date ascending (oldest first)
    scores = db.query(Score).filter(Score.user_id == user.id).order_by(Score.date.asc()).all()

    # If 5 or more scores exist, delete the oldest
    if len(scores) >= 5:
        db.delete(scores[0])

    new_score = Score(
        user_id=user.id,
        score=req.score,
        date=req.date,
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score


@router.get("/scores", response_model=List[ScoreResponse])
def get_scores(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    scores = (
        db.query(Score)
        .filter(Score.user_id == user.id)
        .order_by(Score.date.desc())
        .limit(5)
        .all()
    )
    return scores
