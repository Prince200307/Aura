from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import date, datetime

from app.database import get_session, get_default_user
from app.models.expense import Expense, EXPENSE_CATEGORIES, EXPENSE_TYPES
from app.models.month_snapshot import MonthSnapshot
from pydantic import BaseModel, Field

router = APIRouter(prefix="", tags=["expenses"])


class ExpenseCreate(BaseModel):
    name: str
    amount: float = Field(gt=0)
    expense_type: str = Field(pattern="^(NEED|WANT)$")
    category: str
    is_recurring: bool = False
    expense_date: Optional[date] = None
    note: Optional[str] = None


class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    expense_type: Optional[str] = Field(default=None, pattern="^(NEED|WANT)$")
    category: Optional[str] = None
    is_recurring: Optional[bool] = None
    expense_date: Optional[date] = None
    note: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    month_snapshot_id: int
    name: str
    amount: float
    expense_type: str
    category: str
    is_recurring: bool
    expense_date: date
    note: Optional[str]
    created_at: datetime
    month: Optional[str] = None


def validate_expense(data: ExpenseCreate):
    if not data.name or not data.name.strip():
        raise HTTPException(status_code=400, detail="Expense name cannot be empty or whitespace only")
    if data.category not in EXPENSE_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Category must be one of: {', '.join(EXPENSE_CATEGORIES)}")
    if data.expense_type not in EXPENSE_TYPES:
        raise HTTPException(status_code=400, detail=f"Type must be one of: {', '.join(EXPENSE_TYPES)}")
    return data


def get_month_snapshot_by_string(session: Session, month: str):
    user = get_default_user(session)
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == month)
    return session.exec(stmt).first()


@router.get("/api/expenses/month/{month}", response_model=List[ExpenseResponse])
def list_expenses_by_month(month: str, session: Session = Depends(get_session)):
    month_snapshot = get_month_snapshot_by_string(session, month)
    if not month_snapshot:
        return []
    stmt = select(Expense).where(Expense.month_snapshot_id == month_snapshot.id).order_by(Expense.created_at.desc())
    expenses = session.exec(stmt).all()
    results = []
    for e in expenses:
        results.append(ExpenseResponse(
            id=e.id, month_snapshot_id=e.month_snapshot_id, name=e.name, amount=e.amount,
            expense_type=e.expense_type, category=e.category, is_recurring=e.is_recurring,
            expense_date=e.expense_date, note=e.note, created_at=e.created_at, month=month
        ))
    return results


@router.post("/api/expenses/month/{month}", response_model=ExpenseResponse)
def create_expense_in_month(month: str, data: ExpenseCreate, session: Session = Depends(get_session)):
    validate_expense(data)
    month_snapshot = get_month_snapshot_by_string(session, month)
    if not month_snapshot:
        raise HTTPException(status_code=404, detail="Month snapshot not found")

    expense = Expense(
        month_snapshot_id=month_snapshot.id,
        name=data.name.strip(),
        amount=data.amount,
        expense_type=data.expense_type,
        category=data.category,
        is_recurring=data.is_recurring,
        expense_date=data.expense_date or date.today(),
        note=data.note,
        created_at=datetime.now()
    )
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return ExpenseResponse(
        id=expense.id, month_snapshot_id=expense.month_snapshot_id, name=expense.name,
        amount=expense.amount, expense_type=expense.expense_type, category=expense.category,
        is_recurring=expense.is_recurring, expense_date=expense.expense_date, note=expense.note,
        created_at=expense.created_at, month=month
    )


@router.get("/api/expenses/all", response_model=List[ExpenseResponse])
def list_all_expenses(session: Session = Depends(get_session)):
    user = get_default_user(session)
    month_stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id)
    month_snapshots = {m.id: m.month for m in session.exec(month_stmt).all()}

    stmt = select(Expense).order_by(Expense.created_at.desc())
    expenses = session.exec(stmt).all()
    results = []
    for e in expenses:
        if e.month_snapshot_id in month_snapshots:
            results.append(ExpenseResponse(
                id=e.id, month_snapshot_id=e.month_snapshot_id, name=e.name, amount=e.amount,
                expense_type=e.expense_type, category=e.category, is_recurring=e.is_recurring,
                expense_date=e.expense_date, note=e.note, created_at=e.created_at,
                month=month_snapshots.get(e.month_snapshot_id)
            ))
    return results


@router.get("/api/expenses/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, session: Session = Depends(get_session)):
    user = get_default_user(session)
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    month_stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.id == expense.month_snapshot_id)
    month_snapshot = session.exec(month_stmt).first()
    month_str = month_snapshot.month if month_snapshot else None

    return ExpenseResponse(
        id=expense.id, month_snapshot_id=expense.month_snapshot_id, name=expense.name,
        amount=expense.amount, expense_type=expense.expense_type, category=expense.category,
        is_recurring=expense.is_recurring, expense_date=expense.expense_date, note=expense.note,
        created_at=expense.created_at, month=month_str
    )


@router.patch("/api/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, data: ExpenseUpdate, session: Session = Depends(get_session)):
    user = get_default_user(session)
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    month_stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.id == expense.month_snapshot_id)
    month_snapshot = session.exec(month_stmt).first()
    month_str = month_snapshot.month if month_snapshot else None

    if data.name is not None:
        if not data.name.strip():
            raise HTTPException(status_code=400, detail="Expense name cannot be empty or whitespace only")
        expense.name = data.name.strip()
    if data.amount is not None:
        expense.amount = data.amount
    if data.expense_type is not None:
        if data.expense_type not in EXPENSE_TYPES:
            raise HTTPException(status_code=400, detail=f"Type must be one of: {', '.join(EXPENSE_TYPES)}")
        expense.expense_type = data.expense_type
    if data.category is not None:
        if data.category not in EXPENSE_CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Category must be one of: {', '.join(EXPENSE_CATEGORIES)}")
        expense.category = data.category
    if data.is_recurring is not None:
        expense.is_recurring = data.is_recurring
    if data.expense_date is not None:
        expense.expense_date = data.expense_date
    if data.note is not None:
        expense.note = data.note
    session.commit()
    session.refresh(expense)
    return ExpenseResponse(
        id=expense.id, month_snapshot_id=expense.month_snapshot_id, name=expense.name,
        amount=expense.amount, expense_type=expense.expense_type, category=expense.category,
        is_recurring=expense.is_recurring, expense_date=expense.expense_date, note=expense.note,
        created_at=expense.created_at, month=month_str
    )


@router.delete("/api/expenses/{expense_id}")
def delete_expense(expense_id: int, session: Session = Depends(get_session)):
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    session.delete(expense)
    session.commit()
    return {"detail": "Deleted"}