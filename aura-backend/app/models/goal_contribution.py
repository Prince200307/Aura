from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from sqlalchemy import UniqueConstraint


class GoalContribution(SQLModel, table=True):
    __tablename__ = "goal_contribution"
    __table_args__ = (
        UniqueConstraint("goal_id", "month_snapshot_id", name="uix_goal_month"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    goal_id: int = Field(foreign_key="goal.id")
    month_snapshot_id: int = Field(foreign_key="month_snapshot.id")
    amount_contributed: float
    created_at: datetime = Field(default_factory=datetime.now)