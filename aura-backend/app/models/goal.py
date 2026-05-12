from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

GOAL_STATUSES = ["IN_PROGRESS", "ACHIEVED", "PAUSED"]


class Goal(SQLModel, table=True):
    __tablename__ = "goal"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    target_amount: float
    saved_amount: float = Field(default=0.0)
    deadline_months: int
    status: str = Field(default="IN_PROGRESS")
    created_at: datetime = Field(default_factory=datetime.now)
    achieved_at: Optional[datetime] = Field(default=None)