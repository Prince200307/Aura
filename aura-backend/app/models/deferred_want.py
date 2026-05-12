from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class DeferredWant(SQLModel, table=True):
    __tablename__ = "deferred_want"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    estimated_cost: float
    created_at: datetime = Field(default_factory=datetime.now)