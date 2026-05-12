from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class MonthSnapshot(SQLModel, table=True):
    __tablename__ = "month_snapshot"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    month: str = Field(index=True)
    income: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.now)