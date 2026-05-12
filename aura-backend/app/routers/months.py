from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.database import get_session, get_default_user
from app.models.month_snapshot import MonthSnapshot
from app.models.expense import Expense
from app.models.goal_contribution import GoalContribution
from pydantic import BaseModel, Field

router = APIRouter(prefix="", tags=["months"])


class MonthCreate(BaseModel):
    month: str
    income: float = 0.0


class IncomeUpdate(BaseModel):
    income: float


class MonthSnapshotResponse(BaseModel):
    id: int
    user_id: int
    month: str
    income: float
    created_at: datetime
    total_needs: float
    total_wants: float
    total_goal_contributions: float
    total_saved: float
    remaining: float


def compute_totals(session: Session, snapshot: MonthSnapshot) -> dict:
    stmt_exp = select(Expense).where(Expense.month_snapshot_id == snapshot.id)
    expenses = session.exec(stmt_exp).all()

    total_needs = sum(e.amount for e in expenses if e.expense_type == "NEED")
    total_wants = sum(e.amount for e in expenses if e.expense_type == "WANT")

    stmt_contrib = select(GoalContribution).where(GoalContribution.month_snapshot_id == snapshot.id)
    contributions = session.exec(stmt_contrib).all()
    total_goal_contributions = sum(c.amount_contributed for c in contributions)

    total_saved = snapshot.income - total_needs - total_wants - total_goal_contributions

    return {
        "total_needs": total_needs,
        "total_wants": total_wants,
        "total_goal_contributions": total_goal_contributions,
        "total_saved": total_saved,
        "remaining": total_saved
    }


@router.get("/api/months/", response_model=List[MonthSnapshotResponse])
def list_months(session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id).order_by(MonthSnapshot.month.desc())
    months = session.exec(stmt).all()
    results = []
    for m in months:
        totals = compute_totals(session, m)
        results.append(MonthSnapshotResponse(
            id=m.id, user_id=m.user_id, month=m.month, income=m.income,
            created_at=m.created_at, **totals
        ))
    return results


@router.get("/api/months/{month}", response_model=MonthSnapshotResponse)
def get_month(month: str, session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == month)
    month_snapshot = session.exec(stmt).first()
    if not month_snapshot:
        raise HTTPException(status_code=404, detail="Month snapshot not found")
    totals = compute_totals(session, month_snapshot)
    return MonthSnapshotResponse(
        id=month_snapshot.id, user_id=month_snapshot.user_id, month=month_snapshot.month,
        income=month_snapshot.income, created_at=month_snapshot.created_at, **totals
    )


@router.post("/api/months/", response_model=MonthSnapshotResponse)
def create_month(data: MonthCreate, session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == data.month)
    existing = session.exec(stmt).first()
    if existing:
        totals = compute_totals(session, existing)
        return MonthSnapshotResponse(
            id=existing.id, user_id=existing.user_id, month=existing.month,
            income=existing.income, created_at=existing.created_at, **totals
        )

    month_snapshot = MonthSnapshot(
        user_id=user.id,
        month=data.month,
        income=data.income,
        created_at=datetime.now()
    )
    session.add(month_snapshot)
    session.commit()
    session.refresh(month_snapshot)
    totals = compute_totals(session, month_snapshot)
    return MonthSnapshotResponse(
        id=month_snapshot.id, user_id=month_snapshot.user_id, month=month_snapshot.month,
        income=month_snapshot.income, created_at=month_snapshot.created_at, **totals
    )


@router.patch("/api/months/{month}/income", response_model=MonthSnapshotResponse)
def update_income(month: str, data: IncomeUpdate, session: Session = Depends(get_session)):
    if data.income < 0:
        raise HTTPException(status_code=400, detail="Income cannot be negative")

    user = get_default_user(session)
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == month)
    month_snapshot = session.exec(stmt).first()
    if not month_snapshot:
        raise HTTPException(status_code=404, detail="Month snapshot not found")

    month_snapshot.income = data.income
    session.commit()
    session.refresh(month_snapshot)
    totals = compute_totals(session, month_snapshot)
    return MonthSnapshotResponse(
        id=month_snapshot.id, user_id=month_snapshot.user_id, month=month_snapshot.month,
        income=month_snapshot.income, created_at=month_snapshot.created_at, **totals
    )


@router.delete("/api/months/{month}")
def delete_month(month: str, session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == month)
    month_snapshot = session.exec(stmt).first()
    if not month_snapshot:
        raise HTTPException(status_code=404, detail="Month snapshot not found")
    session.delete(month_snapshot)
    session.commit()
    return {"detail": "Deleted"}