from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.database import get_session, get_default_user
from app.models.recurring_template import RecurringTemplate
from app.models.expense import Expense, EXPENSE_CATEGORIES, EXPENSE_TYPES
from app.models.month_snapshot import MonthSnapshot
from pydantic import BaseModel, Field

router = APIRouter(prefix="", tags=["recurring"])


class RecurringCreate(BaseModel):
    name: str
    amount: float = Field(gt=0)
    category: str
    recurring_type: str = "NEED"


class RecurringUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = None
    recurring_type: Optional[str] = None


class RecurringResponse(BaseModel):
    id: int
    user_id: int
    name: str
    amount: float
    category: str
    recurring_type: str
    created_at: datetime


def validate_recurring(data: RecurringCreate):
    if not data.name or not data.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty or whitespace only")
    if data.category not in EXPENSE_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Category must be one of: {', '.join(EXPENSE_CATEGORIES)}")
    if data.recurring_type not in EXPENSE_TYPES:
        raise HTTPException(status_code=400, detail=f"Type must be one of: {', '.join(EXPENSE_TYPES)}")
    return data


@router.get("/api/recurring/", response_model=List[RecurringResponse])
def list_recurring(session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(RecurringTemplate).where(RecurringTemplate.user_id == user.id).order_by(RecurringTemplate.created_at.desc())
    return session.exec(stmt).all()


@router.get("/api/recurring/suggest/{month}", response_model=List[RecurringResponse])
def suggest_recurring(month: str, session: Session = Depends(get_session)):
    user = get_default_user(session)

    month_stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == month)
    month_snapshot = session.exec(month_stmt).first()
    if not month_snapshot:
        return []

    existing_stmt = select(Expense.category).where(Expense.month_snapshot_id == month_snapshot.id)
    existing_categories = set(session.exec(existing_stmt).all())

    all_templates = session.exec(
        select(RecurringTemplate).where(RecurringTemplate.user_id == user.id)
    ).all()

    suggestions = [t for t in all_templates if t.category not in existing_categories]
    return suggestions


@router.get("/api/recurring/{recurring_id}", response_model=RecurringResponse)
def get_recurring(recurring_id: int, session: Session = Depends(get_session)):
    recurring = session.get(RecurringTemplate, recurring_id)
    if not recurring:
        raise HTTPException(status_code=404, detail="Recurring template not found")
    return recurring


@router.post("/api/recurring/", response_model=RecurringResponse)
def create_recurring(data: RecurringCreate, session: Session = Depends(get_session)):
    validate_recurring(data)
    user = get_default_user(session)
    recurring = RecurringTemplate(
        user_id=user.id,
        name=data.name.strip(),
        amount=data.amount,
        category=data.category,
        recurring_type=data.recurring_type,
        created_at=datetime.now()
    )
    session.add(recurring)
    session.commit()
    session.refresh(recurring)
    return recurring


@router.patch("/api/recurring/{recurring_id}", response_model=RecurringResponse)
def update_recurring(recurring_id: int, data: RecurringUpdate, session: Session = Depends(get_session)):
    recurring = session.get(RecurringTemplate, recurring_id)
    if not recurring:
        raise HTTPException(status_code=404, detail="Recurring template not found")
    if data.name is not None:
        if not data.name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty or whitespace only")
        recurring.name = data.name.strip()
    if data.amount is not None:
        recurring.amount = data.amount
    if data.category is not None:
        if data.category not in EXPENSE_CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Category must be one of: {', '.join(EXPENSE_CATEGORIES)}")
        recurring.category = data.category
    if data.recurring_type is not None:
        if data.recurring_type not in EXPENSE_TYPES:
            raise HTTPException(status_code=400, detail=f"Type must be one of: {', '.join(EXPENSE_TYPES)}")
        recurring.recurring_type = data.recurring_type
    session.commit()
    session.refresh(recurring)
    return recurring


@router.delete("/api/recurring/{recurring_id}")
def delete_recurring(recurring_id: int, session: Session = Depends(get_session)):
    recurring = session.get(RecurringTemplate, recurring_id)
    if not recurring:
        raise HTTPException(status_code=404, detail="Recurring template not found")
    session.delete(recurring)
    session.commit()
    return {"detail": "Deleted"}