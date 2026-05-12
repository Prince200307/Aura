export interface MonthSnapshot {
  id: number;
  user_id: number;
  month: string;
  income: number;
  created_at: string;
  total_needs: number;
  total_wants: number;
  total_goal_contributions: number;
  total_saved: number;
  remaining: number;
}

export interface Expense {
  id: number;
  month_snapshot_id: number;
  name: string;
  amount: number;
  expense_type: "NEED" | "WANT";
  category: string;
  is_recurring: boolean;
  expense_date: string;
  note: string | null;
  created_at: string;
  month?: string;
}

export interface GoalContribution {
  id: number;
  goal_id: number;
  month_snapshot_id: number;
  amount_contributed: number;
  created_at: string;
  month: string;
}

export interface Goal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline_months: number;
  status: "IN_PROGRESS" | "ACHIEVED" | "PAUSED";
  created_at: string;
  achieved_at: string | null;
  progress_percent: number;
  monthly_target: number;
  months_remaining: number;
  contribution_history: GoalContribution[];
}

export interface RecurringTemplate {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  category: string;
  recurring_type: string;
  created_at: string;
}

export interface DeferredWant {
  id: number;
  user_id: number;
  name: string;
  estimated_cost: number;
  created_at: string;
}

export type RecommendationSeverity = "critical" | "warning" | "positive" | "info";

export interface Recommendation {
  id: string;
  severity: RecommendationSeverity;
  title: string;
  body: string;
  action: string | null;
}

export interface HealthScoreBreakdown {
  needs_coverage: string;
  wants_ratio: string;
  savings_rate: string;
  goal_progress: string;
}

export interface HealthScore {
  score: number;
  label: string;
  breakdown: HealthScoreBreakdown;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  health_score: HealthScore | null;
}

export interface ApiError {
  detail: string;
}

export const VALID_CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Personal Care",
  "Other"
] as const;

export type ExpenseCategory = typeof VALID_CATEGORIES[number];