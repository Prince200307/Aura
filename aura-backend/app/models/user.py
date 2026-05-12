from __future__ import annotations

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(default="Prince")
    currency: str = Field(default="INR")
    created_at: datetime = Field(default_factory=datetime.now)