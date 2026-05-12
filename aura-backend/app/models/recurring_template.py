from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class RecurringTemplate(SQLModel, table=True):
    __tablename__ = "recurring_template"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    amount: float
    category: str
    recurring_type: str = Field(default="NEED")
    created_at: datetime = Field(default_factory=datetime.now)