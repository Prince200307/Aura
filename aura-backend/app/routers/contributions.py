from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.database import get_session, get_default_user
from app.models.goal_contribution import GoalContribution
from app.models.goal import Goal
from app.models.month_snapshot import MonthSnapshot
from pydantic import BaseModel, Field

router = APIRouter(prefix="", tags=["contributions"])


class ContributionCreate(BaseModel):
    goal_id: int
    month: str
    amount_contributed: float = Field(gt=0)


class ContributionUpdate(BaseModel):
    amount_contributed: float = Field(gt=0)


class ContributionResponse(BaseModel):
    id: int
    goal_id: int
    month_snapshot_id: int
    amount_contributed: float
    created_at: datetime
    month: str


@router.get("/api/contributions/goal/{goal_id}", response_model=List[ContributionResponse])
def list_contributions_by_goal(goal_id: int, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    stmt = select(GoalContribution, MonthSnapshot).join(
        MonthSnapshot, GoalContribution.month_snapshot_id == MonthSnapshot.id
    ).where(GoalContribution.goal_id == goal_id).order_by(MonthSnapshot.month.desc())
    results = session.exec(stmt).all()

    return [ContributionResponse(
        id=c.id, goal_id=c.goal_id, month_snapshot_id=c.month_snapshot_id,
        amount_contributed=c.amount_contributed, created_at=c.created_at, month=m.month
    ) for c, m in results]


@router.get("/api/contributions/{contribution_id}", response_model=ContributionResponse)
def get_contribution(contribution_id: int, session: Session = Depends(get_session)):
    contribution = session.get(GoalContribution, contribution_id)
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")

    month_stmt = select(MonthSnapshot).where(MonthSnapshot.id == contribution.month_snapshot_id)
    month_snapshot = session.exec(month_stmt).first()
    month_str = month_snapshot.month if month_snapshot else ""

    return ContributionResponse(
        id=contribution.id, goal_id=contribution.goal_id, month_snapshot_id=contribution.month_snapshot_id,
        amount_contributed=contribution.amount_contributed, created_at=contribution.created_at, month=month_str
    )


@router.post("/api/contributions/", response_model=ContributionResponse)
def create_contribution(data: ContributionCreate, session: Session = Depends(get_session)):
    goal = session.get(Goal, data.goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    user = get_default_user(session)
    month_stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id, MonthSnapshot.month == data.month)
    month_snapshot = session.exec(month_stmt).first()
    if not month_snapshot:
        raise HTTPException(status_code=404, detail="Month snapshot not found")

    existing = session.exec(
        select(GoalContribution).where(
            GoalContribution.goal_id == data.goal_id,
            GoalContribution.month_snapshot_id == month_snapshot.id
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="A contribution for this goal and month already exists. Use PATCH to update it.")

    contribution = GoalContribution(
        goal_id=data.goal_id,
        month_snapshot_id=month_snapshot.id,
        amount_contributed=data.amount_contributed,
        created_at=datetime.now()
    )
    session.add(contribution)

    goal.saved_amount += data.amount_contributed
    if goal.saved_amount >= goal.target_amount and goal.status != "ACHIEVED":
        goal.status = "ACHIEVED"
        goal.achieved_at = datetime.now()

    session.commit()
    session.refresh(contribution)
    return ContributionResponse(
        id=contribution.id, goal_id=contribution.goal_id, month_snapshot_id=contribution.month_snapshot_id,
        amount_contributed=contribution.amount_contributed, created_at=contribution.created_at, month=data.month
    )


@router.patch("/api/contributions/{contribution_id}", response_model=ContributionResponse)
def update_contribution(contribution_id: int, data: ContributionUpdate, session: Session = Depends(get_session)):
    contribution = session.get(GoalContribution, contribution_id)
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")

    old_amount = contribution.amount_contributed
    contribution.amount_contributed = data.amount_contributed

    goal = session.get(Goal, contribution.goal_id)
    if goal:
        new_saved = goal.saved_amount - old_amount + data.amount_contributed
        goal.saved_amount = max(0, new_saved)
        if goal.status == "ACHIEVED" and goal.saved_amount < goal.target_amount:
            goal.status = "IN_PROGRESS"
            goal.achieved_at = None

    session.commit()
    session.refresh(contribution)

    month_stmt = select(MonthSnapshot).where(MonthSnapshot.id == contribution.month_snapshot_id)
    month_snapshot = session.exec(month_stmt).first()
    month_str = month_snapshot.month if month_snapshot else ""

    return ContributionResponse(
        id=contribution.id, goal_id=contribution.goal_id, month_snapshot_id=contribution.month_snapshot_id,
        amount_contributed=contribution.amount_contributed, created_at=contribution.created_at, month=month_str
    )


@router.delete("/api/contributions/{contribution_id}")
def delete_contribution(contribution_id: int, session: Session = Depends(get_session)):
    contribution = session.get(GoalContribution, contribution_id)
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")

    goal = session.get(Goal, contribution.goal_id)
    if goal:
        goal.saved_amount = max(0, goal.saved_amount - contribution.amount_contributed)
        if goal.status == "ACHIEVED" and goal.saved_amount < goal.target_amount:
            goal.status = "IN_PROGRESS"
            goal.achieved_at = None

    session.delete(contribution)
    session.commit()
    return {"detail": "Deleted"}