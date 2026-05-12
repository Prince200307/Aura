from typing import Optional, List, Dict, Any
from dataclasses import dataclass


@dataclass
class Recommendation:
    id: str
    severity: str
    title: str
    body: str
    action: Optional[str] = None


@dataclass
class HealthScore:
    score: int
    label: str
    breakdown: Dict[str, Any]


def repeating_want_detection(all_months_expenses: List[Dict[str, Any]]) -> Optional[Recommendation]:
    category_months: Dict[str, List[str]] = {}

    for expense in all_months_expenses:
        if expense.get("expense_type") == "WANT":
            cat = expense.get("category")
            month = expense.get("month")
            if cat and month:
                if cat not in category_months:
                    category_months[cat] = []
                category_months[cat].append(month)

    for cat, months in category_months.items():
        sorted_months = sorted(months)
        consecutive_count = 1
        max_consecutive = 1

        for i in range(1, len(sorted_months)):
            curr_parts = sorted_months[i].split("-")
            prev_parts = sorted_months[i-1].split("-")
            curr_year, curr_month = int(curr_parts[0]), int(curr_parts[1])
            prev_year, prev_month = int(prev_parts[0]), int(prev_parts[1])

            if (curr_year == prev_year and curr_month == prev_month + 1) or \
               (curr_year == prev_year + 1 and curr_month == 1 and prev_month == 12):
                consecutive_count += 1
                max_consecutive = max(max_consecutive, consecutive_count)
            else:
                consecutive_count = 1

        if max_consecutive >= 3:
            return Recommendation(
                id="W5.0",
                severity="warning",
                title=f"Repeating Want: {cat}",
                body=f"You've had {cat} expenses in {max_consecutive} consecutive months. Consider if this is becoming a regular expense.",
                action="Review and categorize as recurring if needed"
            )
    return None


def wants_to_income_ratio(total_wants: float, income: float) -> Optional[Recommendation]:
    if income == 0:
        return None

    ratio = (total_wants / income) * 100

    if 40 <= ratio <= 60:
        return Recommendation(
            id="W5.1",
            severity="warning",
            title="Wants Approaching Budget Limit",
            body=f"Your wants spending is {ratio:.1f}% of income (₹{total_wants:.0f}). Try to reduce to 40% to keep spending healthy.",
            action=f"Reduce wants by ₹{total_wants - (income * 0.4):.0f} to reach 40%"
        )
    elif ratio > 60:
        excess = total_wants - (income * 0.4)
        return Recommendation(
            id="W5.1",
            severity="critical",
            title="Wants Exceeding Safe Limit",
            body=f"Your wants spending is {ratio:.1f}% of income (₹{total_wants:.0f}). This is above the recommended 40% threshold.",
            action=f"Reduce wants by ₹{excess:.0f} to get to 40%"
        )
    return None


def goal_pace_alert(goal: Dict[str, Any], current_month_contribution: float) -> Optional[Recommendation]:
    if goal.get("status") != "IN_PROGRESS":
        return None

    monthly_target = goal.get("monthly_target", 0)
    if monthly_target <= 0:
        return None

    if current_month_contribution < monthly_target:
        shortfall = monthly_target - current_month_contribution
        remaining = goal.get("target_amount", 0) - goal.get("saved_amount", 0)
        new_completion = remaining / current_month_contribution if current_month_contribution > 0 else 999

        return Recommendation(
            id="W5.2",
            severity="warning",
            title=f"Goal Pace Alert: {goal.get('name')}",
            body=f"You're contributing ₹{current_month_contribution:.0f} this month but need ₹{monthly_target:.0f} to stay on track. Shortfall: ₹{shortfall:.0f}",
            action=f"At current pace, goal completion extends to {new_completion:.1f} months"
        )
    return None


def budget_health_score(income: float, total_needs: float, total_wants: float, total_contributions: float, goals: List[Dict]) -> HealthScore:
    points = 0

    if income > 0:
        if total_needs <= income:
            points += 25
        elif total_needs <= income * 1.2:
            points += 15

        if income > 0 and (total_wants / income) <= 0.4:
            points += 25

        savings = income - total_needs - total_wants - total_contributions
        if income > 0 and (savings / income) > 0.1:
            points += 25

    has_active_goal_with_contribution = any(
        g.get("status") == "IN_PROGRESS" for g in goals
    )
    if has_active_goal_with_contribution:
        points += 25
    elif income > 0:
        points += 15

    if points >= 80:
        label = "Healthy"
    elif points >= 60:
        label = "Fair"
    elif points >= 40:
        label = "Needs Attention"
    else:
        label = "Critical"

    return HealthScore(
        score=points,
        label=label,
        breakdown={
            "needs_coverage": "OK" if total_needs <= income else "Exceeds income",
            "wants_ratio": f"{(total_wants/income*100):.1f}%" if income > 0 else "N/A",
            "savings_rate": f"{((income-total_needs-total_wants-total_contributions)/income*100):.1f}%" if income > 0 else "N/A",
            "goal_progress": "Active" if has_active_goal_with_contribution else "None"
        }
    )


def surplus_reallocation(remaining: float, active_goals: List[Dict[str, Any]]) -> Optional[Recommendation]:
    if remaining <= 0 or not active_goals:
        return None

    sorted_goals = sorted(active_goals, key=lambda g: g.get("months_remaining", 999))
    closest_deadline = sorted_goals[0]

    return Recommendation(
        id="W5.4",
        severity="info",
        title=f"Surplus Available: ₹{remaining:.0f}",
        body=f"You have ₹{remaining:.0f} remaining. Consider adding it to '{closest_deadline.get('name')}' which has the closest deadline.",
        action=f"Add ₹{remaining:.0f} to {closest_deadline.get('name')}"
    )


def category_threshold_alert(current_month_expenses: List[Dict], historical_expenses: List[Dict]) -> Optional[Recommendation]:
    category_totals_current: Dict[str, float] = {}
    category_totals_historical: Dict[str, List[float]] = {}

    for exp in current_month_expenses:
        if exp.get("expense_type") == "WANT":
            cat = exp.get("category")
            if cat:
                category_totals_current[cat] = category_totals_current.get(cat, 0) + exp.get("amount", 0)

    for exp in historical_expenses:
        if exp.get("expense_type") == "WANT":
            cat = exp.get("category")
            if cat:
                if cat not in category_totals_historical:
                    category_totals_historical[cat] = []
                category_totals_historical[cat].append(exp.get("amount", 0))

    for cat, current_amount in category_totals_current.items():
        if cat in category_totals_historical and len(category_totals_historical[cat]) >= 2:
            avg = sum(category_totals_historical[cat]) / len(category_totals_historical[cat])
            if current_amount > avg * 1.5:
                return Recommendation(
                    id="W5.5",
                    severity="warning",
                    title=f"Category Spike: {cat}",
                    body=f"Your {cat} spending is ₹{current_amount:.0f}, which is 150% of your 3-month average (₹{avg:.0f})",
                    action="Review if this is a one-time expense or new pattern"
                )
    return None


def month_over_month_delta(current_month_expenses: List[Dict], last_month_expenses: List[Dict]) -> List[Recommendation]:
    recommendations = []
    category_current: Dict[str, float] = {}
    category_last: Dict[str, float] = {}

    for exp in current_month_expenses:
        if exp.get("expense_type") == "WANT":
            cat = exp.get("category")
            if cat:
                category_current[cat] = category_current.get(cat, 0) + exp.get("amount", 0)

    for exp in last_month_expenses:
        if exp.get("expense_type") == "WANT":
            cat = exp.get("category")
            if cat:
                category_last[cat] = category_last.get(cat, 0) + exp.get("amount", 0)

    deltas = []
    for cat in set(list(category_current.keys()) + list(category_last.keys())):
        curr = category_current.get(cat, 0)
        last = category_last.get(cat, 0)
        if last > 0:
            deltas.append((cat, curr - last, (curr - last) / last * 100 if last > 0 else 0))

    deltas.sort(key=lambda x: x[1], reverse=True)

    for cat, delta, pct in deltas[:3]:
        if delta > 500:
            recommendations.append(Recommendation(
                id="W5.6",
                severity="warning",
                title=f"Increased Spending: {cat}",
                body=f"Your {cat} spending increased by ₹{delta:.0f} ({pct:.0f}%) compared to last month",
                action="Monitor if this becomes a trend"
            ))

    for cat, delta, pct in deltas[-3:]:
        if delta < -500:
            recommendations.append(Recommendation(
                id="W5.6",
                severity="positive",
                title=f"Reduced Spending: {cat}",
                body=f"Great job! You reduced {cat} spending by ₹{abs(delta):.0f} compared to last month",
                action=None
            ))

    return recommendations[:6]


def needs_creep_detection(last_3_months_snapshots: List[Dict]) -> Optional[Recommendation]:
    if len(last_3_months_snapshots) < 3:
        return None

    needs_values = [s.get("total_needs", 0) for s in last_3_months_snapshots]

    if needs_values[0] > needs_values[1] > needs_values[2]:
        growth = needs_values[0] - needs_values[2]
        return Recommendation(
            id="W5.7",
            severity="warning",
            title="Needs Creep Detected",
            body=f"Your NEED expenses have increased for 3 consecutive months. Total growth: ₹{growth:.0f}",
            action="Review if this is due to price increases or lifestyle changes"
        )
    return None


def savings_rate_tracker(last_3_months_snapshots: List[Dict]) -> Optional[Recommendation]:
    if len(last_3_months_snapshots) < 2:
        return None

    savings_rates = []
    for s in last_3_months_snapshots:
        income = s.get("income", 0)
        saved = s.get("total_saved", 0)
        if income > 0:
            savings_rates.append((saved / income) * 100)

    if len(savings_rates) >= 2:
        if savings_rates[0] < savings_rates[1] and len(savings_rates) >= 2 and savings_rates[1] <= savings_rates[2]:
            return Recommendation(
                id="W5.8",
                severity="warning",
                title="Declining Savings Rate",
                body=f"Your savings rate has declined over the last 2-3 months. Current: {savings_rates[0]:.1f}%",
                action="Look for areas to cut back and rebuild savings"
            )
        elif savings_rates[0] > savings_rates[1]:
            return Recommendation(
                id="W5.8",
                severity="positive",
                title="Improving Savings Rate",
                body=f"Your savings rate is improving! Previous: {savings_rates[1]:.1f}%, Current: {savings_rates[0]:.1f}%",
                action=None
            )
    return None


def impulse_spend_detection(new_expense: Dict, last_3_months_expenses: List[Dict]) -> Optional[Recommendation]:
    amount = new_expense.get("amount", 0)
    category = new_expense.get("category")

    if amount >= 1500 and category:
        has_prior_spend = any(e.get("category") == category for e in last_3_months_expenses)
        if not has_prior_spend:
            return Recommendation(
                id="W5.9",
                severity="info",
                title="Potential Impulse Purchase",
                body=f"This ₹{amount:.0f} expense in {category} is your first in 3 months. Consider if it's a want or genuine need.",
                action="Wait 24 hours before finalizing"
            )
    return None


def optimal_goal_split(surplus: float, active_goals: List[Dict[str, Any]]) -> Optional[Recommendation]:
    if surplus <= 0 or len(active_goals) < 2:
        return None

    weights = []
    for g in active_goals:
        months_remaining = g.get("months_remaining", 1)
        if months_remaining > 0:
            weights.append(1 / months_remaining)

    total_weight = sum(weights)
    if total_weight == 0:
        return None

    normalized = [w / total_weight for w in weights]

    suggestions = []
    for i, g in enumerate(active_goals):
        allocation = surplus * normalized[i]
        suggestions.append(f"₹{allocation:.0f} to {g.get('name')}")

    return Recommendation(
        id="W5.10",
        severity="info",
        title="Optimal Goal Allocation",
        body=f"With ₹{surplus:.0f} surplus, recommended split: {' | '.join(suggestions)}",
        action="Allocate based on deadline urgency"
    )


def defer_vs_buy_now(want_expense: Dict, remaining_after_needs_and_contributions: float) -> Optional[Recommendation]:
    if want_expense.get("expense_type") != "WANT":
        return None

    amount = want_expense.get("amount", 0)
    if amount >= 2000:
        return None

    if remaining_after_needs_and_contributions >= amount * 2:
        return Recommendation(
            id="W5.11",
            severity="positive",
            title="Affordable Purchase",
            body=f"You can afford this ₹{amount:.0f} expense without straining your budget.",
            action="Go ahead if it's something you need"
        )
    elif remaining_after_needs_and_contributions < amount:
        return Recommendation(
            id="W5.11",
            severity="warning",
            title="Consider Deferring",
            body=f"This ₹{amount:.0f} expense would use {amount/remaining_after_needs_and_contributions*100:.0f}% of your remaining budget. Consider waiting.",
            action="Add to deferred wants list"
        )
    return None