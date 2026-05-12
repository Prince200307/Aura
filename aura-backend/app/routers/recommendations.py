from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional, Dict, Any

from app.database import get_session, get_default_user
from app.models.month_snapshot import MonthSnapshot
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.goal_contribution import GoalContribution
from app import engine

router = APIRouter(prefix="", tags=["recommendations"])


def get_month_snapshot_by_string(session: Session, month: str, user_id: int):
    stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user_id, MonthSnapshot.month == month)
    return session.exec(stmt).first()


def get_last_n_months(user_id: int, n: int) -> List[str]:
    months = []
    year, month = 2026, 5
    for _ in range(n):
        months.append(f"{year}-{month:02d}")
        month -= 1
        if month == 0:
            month = 12
            year -= 1
    return months


def get_month_totals(session: Session, month_snapshot: MonthSnapshot) -> Dict[str, Any]:
    stmt_exp = select(Expense).where(Expense.month_snapshot_id == month_snapshot.id)
    expenses = session.exec(stmt_exp).all()

    total_needs = sum(e.amount for e in expenses if e.expense_type == "NEED")
    total_wants = sum(e.amount for e in expenses if e.expense_type == "WANT")

    stmt_contrib = select(GoalContribution).where(GoalContribution.month_snapshot_id == month_snapshot.id)
    contributions = session.exec(stmt_contrib).all()
    total_goal_contributions = sum(c.amount_contributed for c in contributions)

    total_saved = month_snapshot.income - total_needs - total_wants - total_goal_contributions

    return {
        "income": month_snapshot.income,
        "total_needs": total_needs,
        "total_wants": total_wants,
        "total_goal_contributions": total_goal_contributions,
        "total_saved": total_saved,
        "remaining": total_saved
    }


def expense_to_dict(expense: Expense, month: str) -> Dict[str, Any]:
    return {
        "id": expense.id,
        "amount": expense.amount,
        "expense_type": expense.expense_type,
        "category": expense.category,
        "month": month
    }


def goal_to_dict(goal: Goal) -> Dict[str, Any]:
    progress_percent = (goal.saved_amount / goal.target_amount) * 100 if goal.target_amount > 0 else 0
    monthly_target = goal.target_amount / goal.deadline_months if goal.deadline_months > 0 else 0
    remaining = goal.target_amount - goal.saved_amount
    months_remaining = remaining / monthly_target if monthly_target > 0 else 0

    return {
        "id": goal.id,
        "name": goal.name,
        "target_amount": goal.target_amount,
        "saved_amount": goal.saved_amount,
        "deadline_months": goal.deadline_months,
        "status": goal.status,
        "progress_percent": round(progress_percent, 2),
        "monthly_target": round(monthly_target, 2),
        "months_remaining": round(months_remaining, 2)
    }


@router.get("/api/recommendations/{month}")
def get_recommendations(month: str, session: Session = Depends(get_session)):
    user = get_default_user(session)

    current_month_snapshot = get_month_snapshot_by_string(session, month, user.id)
    if not current_month_snapshot:
        return {"recommendations": [], "health_score": None}

    current_totals = get_month_totals(session, current_month_snapshot)

    current_month_expenses = session.exec(
        select(Expense).where(Expense.month_snapshot_id == current_month_snapshot.id)
    ).all()
    current_expenses_dicts = [expense_to_dict(e, month) for e in current_month_expenses]

    last_3_months = get_last_n_months(user.id, 3)
    last_3_snapshots = []
    last_3_expenses = []

    for m in last_3_months:
        ms = get_month_snapshot_by_string(session, m, user.id)
        if ms:
            last_3_snapshots.append({**get_month_totals(session, ms), "month": m})
            exps = session.exec(select(Expense).where(Expense.month_snapshot_id == ms.id)).all()
            last_3_expenses.extend([expense_to_dict(e, m) for e in exps])

    all_months_stmt = select(MonthSnapshot).where(MonthSnapshot.user_id == user.id)
    all_months = session.exec(all_months_stmt).all()
    all_expenses = []
    for m in all_months:
        exps = session.exec(select(Expense).where(Expense.month_snapshot_id == m.id)).all()
        all_expenses.extend([expense_to_dict(e, m.month) for e in exps])

    goals_stmt = select(Goal).where(Goal.user_id == user.id, Goal.status == "IN_PROGRESS")
    active_goals = [goal_to_dict(g) for g in session.exec(goals_stmt).all()]

    current_month_contribution = 0
    if current_month_snapshot:
        contribs = session.exec(
            select(GoalContribution).where(GoalContribution.month_snapshot_id == current_month_snapshot.id)
        ).all()
        current_month_contribution = sum(c.amount_contributed for c in contribs)

    recommendations = []
    rec = engine.repeating_want_detection(all_expenses)
    if rec:
        recommendations.append(rec)

    rec = engine.wants_to_income_ratio(current_totals["total_wants"], current_totals["income"])
    if rec:
        recommendations.append(rec)

    for g in active_goals:
        rec = engine.goal_pace_alert(g, current_month_contribution)
        if rec:
            recommendations.append(rec)

    rec = engine.surplus_reallocation(current_totals.get("remaining", 0), active_goals)
    if rec:
        recommendations.append(rec)

    rec = engine.category_threshold_alert(current_expenses_dicts, last_3_expenses)
    if rec:
        recommendations.append(rec)

    if len(last_3_snapshots) >= 2:
        last_month_expenses = [e for e in last_3_expenses if e["month"] == last_3_months[1]]
        current_month_for_delta = [e for e in current_expenses_dicts]
        recs = engine.month_over_month_delta(current_month_for_delta, last_month_expenses)
        recommendations.extend(recs)

    if len(last_3_snapshots) >= 3:
        rec = engine.needs_creep_detection(last_3_snapshots)
        if rec:
            recommendations.append(rec)

    rec = engine.savings_rate_tracker(last_3_snapshots)
    if rec:
        recommendations.append(rec)

    rec = engine.optimal_goal_split(current_totals.get("remaining", 0), active_goals)
    if rec:
        recommendations.append(rec)

    if current_expenses_dicts:
        last_3_months_expenses = [e for e in last_3_expenses if e["month"] in last_3_months[:3]]
        for exp in current_expenses_dicts:
            rec = engine.impulse_spend_detection(exp, last_3_months_expenses)
            if rec:
                recommendations.append(rec)

    health_score = engine.budget_health_score(
        current_totals["income"],
        current_totals["total_needs"],
        current_totals["total_wants"],
        current_totals["total_goal_contributions"],
        active_goals
    )

    severity_order = {"critical": 0, "warning": 1, "positive": 2, "info": 3}
    recommendations.sort(key=lambda r: severity_order.get(r.severity, 4))

    return {
        "recommendations": [
            {"id": r.id, "severity": r.severity, "title": r.title, "body": r.body, "action": r.action}
            for r in recommendations
        ],
        "health_score": {
            "score": health_score.score,
            "label": health_score.label,
            "breakdown": health_score.breakdown
        }
    }


@router.get("/api/recommendations/{month}/impulse/{expense_id}")
def check_impulse(month: str, expense_id: int, session: Session = Depends(get_session)):
    user = get_default_user(session)

    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    month_snapshot = get_month_snapshot_by_string(session, month, user.id)
    if not month_snapshot:
        return {"recommendation": None}

    last_3_months = get_last_n_months(user.id, 3)
    last_3_expenses = []

    for m in last_3_months:
        ms = get_month_snapshot_by_string(session, m, user.id)
        if ms:
            exps = session.exec(select(Expense).where(Expense.month_snapshot_id == ms.id)).all()
            last_3_expenses.extend([expense_to_dict(e, m) for e in exps])

    expense_dict = expense_to_dict(expense, month)
    rec = engine.impulse_spend_detection(expense_dict, last_3_expenses)

    if rec:
        return {
            "recommendation": {
                "id": rec.id,
                "severity": rec.severity,
                "title": rec.title,
                "body": rec.body,
                "action": rec.action
            }
        }
    return {"recommendation": None}