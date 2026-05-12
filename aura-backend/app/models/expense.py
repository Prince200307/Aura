from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from datetime import date as dt_date

EXPENSE_CATEGORIES = [
    "Food", "Rent", "Transport", "Utilities",
    "Entertainment", "Shopping", "Health", "Education",
    "Personal Care", "Other"
]
EXPENSE_TYPES = ["NEED", "WANT"]


class Expense(SQLModel, table=True):
    __tablename__ = "expense"

    id: Optional[int] = Field(default=None, primary_key=True)
    month_snapshot_id: int = Field(foreign_key="month_snapshot.id")
    name: str
    amount: float
    expense_type: str
    category: str
    is_recurring: bool = Field(default=False)
    expense_date: dt_date = Field(default_factory=lambda: dt_date.today())
    note: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)