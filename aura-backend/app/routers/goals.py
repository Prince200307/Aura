from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.database import get_session, get_default_user
from app.models.goal import Goal, GOAL_STATUSES
from app.models.goal_contribution import GoalContribution
from app.models.month_snapshot import MonthSnapshot
from pydantic import BaseModel, Field

router = APIRouter(prefix="", tags=["goals"])


class GoalCreate(BaseModel):
    name: str
    target_amount: float = Field(ge=5000)
    deadline_months: int = Field(ge=1, le=60)


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = Field(default=None, ge=5000)
    deadline_months: Optional[int] = Field(default=None, ge=1, le=60)


class ContributionHistoryItem(BaseModel):
    month: str
    amount_contributed: float


class GoalResponse(BaseModel):
    id: int
    user_id: int
    name: str
    target_amount: float
    saved_amount: float
    deadline_months: int
    status: str
    created_at: datetime
    achieved_at: Optional[datetime]
    progress_percent: float
    monthly_target: float
    months_remaining: float
    contribution_history: List[ContributionHistoryItem]


def compute_goal_fields(goal: Goal) -> dict:
    progress_percent = (goal.saved_amount / goal.target_amount) * 100 if goal.target_amount > 0 else 0
    monthly_target = goal.target_amount / goal.deadline_months if goal.deadline_months > 0 else 0
    remaining = goal.target_amount - goal.saved_amount
    months_remaining = remaining / monthly_target if monthly_target > 0 else 0
    return {
        "progress_percent": round(progress_percent, 2),
        "monthly_target": round(monthly_target, 2),
        "months_remaining": round(months_remaining, 2)
    }


def get_contribution_history(session: Session, goal_id: int) -> List[ContributionHistoryItem]:
    stmt = select(GoalContribution, MonthSnapshot).join(
        MonthSnapshot, GoalContribution.month_snapshot_id == MonthSnapshot.id
    ).where(GoalContribution.goal_id == goal_id).order_by(MonthSnapshot.month.desc())
    results = session.exec(stmt).all()
    return [ContributionHistoryItem(month=m.month, amount_contributed=c.amount_contributed) for c, m in results]


@router.get("/api/goals/", response_model=List[GoalResponse])
def list_goals(session: Session = Depends(get_session)):
    user = get_default_user(session)
    stmt = select(Goal).where(Goal.user_id == user.id).order_by(
        Goal.status,
        Goal.created_at.desc()
    )
    goals = session.exec(stmt).all()

    status_order = {"IN_PROGRESS": 0, "PAUSED": 1, "ACHIEVED": 2}
    sorted_goals = sorted(goals, key=lambda g: (status_order.get(g.status, 3), g.created_at), reverse=True)

    results = []
    for g in sorted_goals:
        fields = compute_goal_fields(g)
        history = get_contribution_history(session, g.id)
        results.append(GoalResponse(
            id=g.id, user_id=g.user_id, name=g.name, target_amount=g.target_amount,
            saved_amount=g.saved_amount, deadline_months=g.deadline_months, status=g.status,
            created_at=g.created_at, achieved_at=g.achieved_at,
            contribution_history=history, **fields
        ))
    return results


@router.get("/api/goals/{goal_id}", response_model=GoalResponse)
def get_goal(goal_id: int, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    fields = compute_goal_fields(goal)
    history = get_contribution_history(session, goal_id)
    return GoalResponse(
        id=goal.id, user_id=goal.user_id, name=goal.name, target_amount=goal.target_amount,
        saved_amount=goal.saved_amount, deadline_months=goal.deadline_months, status=goal.status,
        created_at=goal.created_at, achieved_at=goal.achieved_at,
        contribution_history=history, **fields
    )


@router.post("/api/goals/", response_model=GoalResponse)
def create_goal(data: GoalCreate, session: Session = Depends(get_session)):
    user = get_default_user(session)
    goal = Goal(
        user_id=user.id,
        name=data.name,
        target_amount=data.target_amount,
        saved_amount=0.0,
        deadline_months=data.deadline_months,
        status="IN_PROGRESS",
        created_at=datetime.now()
    )
    session.add(goal)
    session.commit()
    session.refresh(goal)
    fields = compute_goal_fields(goal)
    return GoalResponse(
        id=goal.id, user_id=goal.user_id, name=goal.name, target_amount=goal.target_amount,
        saved_amount=goal.saved_amount, deadline_months=goal.deadline_months, status=goal.status,
        created_at=goal.created_at, achieved_at=goal.achieved_at,
        contribution_history=[], **fields
    )


@router.patch("/api/goals/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, data: GoalUpdate, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.status == "ACHIEVED":
        raise HTTPException(status_code=400, detail="Cannot update an achieved goal")

    if data.name is not None:
        goal.name = data.name
    if data.target_amount is not None:
        goal.target_amount = data.target_amount
    if data.deadline_months is not None:
        goal.deadline_months = data.deadline_months

    session.commit()
    session.refresh(goal)
    fields = compute_goal_fields(goal)
    history = get_contribution_history(session, goal_id)
    return GoalResponse(
        id=goal.id, user_id=goal.user_id, name=goal.name, target_amount=goal.target_amount,
        saved_amount=goal.saved_amount, deadline_months=goal.deadline_months, status=goal.status,
        created_at=goal.created_at, achieved_at=goal.achieved_at,
        contribution_history=history, **fields
    )


@router.patch("/api/goals/{goal_id}/achieve", response_model=GoalResponse)
def achieve_goal(goal_id: int, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.status == "ACHIEVED":
        raise HTTPException(status_code=400, detail="Goal is already achieved")
    if goal.saved_amount < goal.target_amount:
        raise HTTPException(status_code=400, detail="Cannot achieve goal prematurely - saved amount is less than target amount")

    goal.status = "ACHIEVED"
    goal.achieved_at = datetime.now()
    session.commit()
    session.refresh(goal)
    fields = compute_goal_fields(goal)
    history = get_contribution_history(session, goal_id)
    return GoalResponse(
        id=goal.id, user_id=goal.user_id, name=goal.name, target_amount=goal.target_amount,
        saved_amount=goal.saved_amount, deadline_months=goal.deadline_months, status=goal.status,
        created_at=goal.created_at, achieved_at=goal.achieved_at,
        contribution_history=history, **fields
    )


@router.patch("/api/goals/{goal_id}/pause", response_model=GoalResponse)
def pause_goal(goal_id: int, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if goal.status == "ACHIEVED":
        raise HTTPException(status_code=400, detail="Cannot pause an achieved goal")

    if goal.status == "PAUSED":
        goal.status = "IN_PROGRESS"
    else:
        goal.status = "PAUSED"

    session.commit()
    session.refresh(goal)
    fields = compute_goal_fields(goal)
    history = get_contribution_history(session, goal_id)
    return GoalResponse(
        id=goal.id, user_id=goal.user_id, name=goal.name, target_amount=goal.target_amount,
        saved_amount=goal.saved_amount, deadline_months=goal.deadline_months, status=goal.status,
        created_at=goal.created_at, achieved_at=goal.achieved_at,
        contribution_history=history, **fields
    )


@router.delete("/api/goals/{goal_id}")
def delete_goal(goal_id: int, session: Session = Depends(get_session)):
    goal = session.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    stmt = select(GoalContribution).where(GoalContribution.goal_id == goal_id)
    contributions = session.exec(stmt).all()
    for c in contributions:
        session.delete(c)

    session.delete(goal)
    session.commit()
    return {"detail": "Deleted"}