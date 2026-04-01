import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Winner, User
from schemas import WinnerResponse, WinnerStatusUpdate
from auth import get_current_user, require_admin
from typing import List

router = APIRouter(tags=["Winners"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/winnings", response_model=List[WinnerResponse])
def get_my_winnings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    wins = (
        db.query(Winner)
        .filter(Winner.user_id == user.id)
        .order_by(Winner.created_at.desc())
        .all()
    )
    return [
        WinnerResponse(
            id=w.id, user_id=w.user_id, draw_id=w.draw_id,
            match_count=w.match_count, proof_image=w.proof_image,
            status=w.status, created_at=w.created_at,
            user_name=w.user.name, user_email=w.user.email,
        )
        for w in wins
    ]


@router.post("/winner/upload-proof")
async def upload_proof(
    winner_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    winner = db.query(Winner).filter(Winner.id == winner_id, Winner.user_id == user.id).first()
    if not winner:
        raise HTTPException(status_code=404, detail="Winner record not found")

    ext = os.path.splitext(file.filename)[1] if file.filename else ".png"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    winner.proof_image = f"/uploads/{filename}"
    db.commit()
    return {"message": "Proof uploaded", "proof_image": winner.proof_image}


@router.get("/admin/winners", response_model=List[WinnerResponse])
def admin_get_winners(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    wins = db.query(Winner).order_by(Winner.created_at.desc()).all()
    return [
        WinnerResponse(
            id=w.id, user_id=w.user_id, draw_id=w.draw_id,
            match_count=w.match_count, proof_image=w.proof_image,
            status=w.status, created_at=w.created_at,
            user_name=w.user.name, user_email=w.user.email,
        )
        for w in wins
    ]


@router.put("/admin/winners/{winner_id}/status")
def update_winner_status(
    winner_id: int,
    req: WinnerStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    winner = db.query(Winner).filter(Winner.id == winner_id).first()
    if not winner:
        raise HTTPException(status_code=404, detail="Winner not found")
    winner.status = req.status
    db.commit()
    return {"message": f"Status updated to {req.status}"}
