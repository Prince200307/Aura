from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime

from app.database import get_session, get_default_user
from app.models.deferred_want import DeferredWant
from pydantic import BaseModel, Field

router = APIRouter(prefix="", tags=["deferred"])


class DeferredWantCreate(BaseModel):
    name: str
    estimated_cost: float = Field(lt=5000)


class DeferredWantResponse(BaseModel):
    id: int
    user_id: int
    name: str
    estimated_cost: float
    created_at: datetime


@router.get("/api/deferred/", response_model=List[DeferredWantResponse])
def list_deferred_wants(session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(DeferredWant).where(DeferredWant.user_id == user.id).order_by(DeferredWant.created_at.desc())
    return session.exec(stmt).all()


@router.post("/api/deferred/", response_model=DeferredWantResponse)
def create_deferred_want(data: DeferredWantCreate, session: Session = Depends(get_session)):
    if not data.name or not data.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty or whitespace only")
    if data.estimated_cost >= 5000:
        raise HTTPException(status_code=400, detail="Estimated cost must be less than 5000 (items at or above this qualify as goals)")

    user = get_default_user(session)
    deferred = DeferredWant(
        user_id=user.id,
        name=data.name.strip(),
        estimated_cost=data.estimated_cost,
        created_at=datetime.now()
    )
    session.add(deferred)
    session.commit()
    session.refresh(deferred)
    return deferred


@router.delete("/api/deferred/{deferred_id}")
def delete_deferred_want(deferred_id: int, session: Session = Depends(get_session)):
    deferred = session.get(DeferredWant, deferred_id)
    if not deferred:
        raise HTTPException(status_code=404, detail="Deferred want not found")
    session.delete(deferred)
    session.commit()
    return {"detail": "Deleted"}