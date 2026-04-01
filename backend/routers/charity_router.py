from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Charity, User
from schemas import CharityResponse, CharitySelectRequest
from auth import get_current_user, require_admin
from typing import List
from pydantic import BaseModel

router = APIRouter(tags=["Charities"])


@router.get("/charities", response_model=List[CharityResponse])
def list_charities(db: Session = Depends(get_db)):
    return db.query(Charity).all()


@router.post("/charity/select")
def select_charity(
    req: CharitySelectRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    charity = db.query(Charity).filter(Charity.id == req.charity_id).first()
    if not charity:
        raise HTTPException(status_code=404, detail="Charity not found")

    user.charity_id = req.charity_id
    user.charity_percentage = req.percentage
    db.commit()
    return {"message": "Charity selection saved", "charity_id": req.charity_id, "percentage": req.percentage}


# ── Admin: manage charities ─────────────────────
class CharityCreate(BaseModel):
    name: str
    description: str = ""
    image: str = ""


@router.post("/admin/charities", response_model=CharityResponse)
def create_charity(
    req: CharityCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    charity = Charity(name=req.name, description=req.description, image=req.image)
    db.add(charity)
    db.commit()
    db.refresh(charity)
    return charity


@router.delete("/admin/charities/{charity_id}")
def delete_charity(
    charity_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    charity = db.query(Charity).filter(Charity.id == charity_id).first()
    if not charity:
        raise HTTPException(status_code=404, detail="Charity not found")
    db.delete(charity)
    db.commit()
    return {"message": "Charity deleted"}
