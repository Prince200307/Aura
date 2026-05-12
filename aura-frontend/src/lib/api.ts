import type {
  MonthSnapshot,
  Expense,
  Goal,
  GoalContribution,
  RecurringTemplate,
  DeferredWant,
  RecommendationsResponse,
  Recommendation,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  method: string = "GET",
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detail = errorData.detail || "An unknown error occurred";
      throw new Error(detail);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network request failed. Please check your connection.");
  }
}

export const monthsApi = {
  getAllMonths: () => request<MonthSnapshot[]>("/api/months/"),

  getMonth: (month: string) => request<MonthSnapshot>(`/api/months/${month}`),

  createOrGetMonth: (month: string, income: number = 0) =>
    request<MonthSnapshot>("/api/months/", "POST", { month, income }),

  updateIncome: (month: string, income: number) =>
    request<MonthSnapshot>(`/api/months/${month}/income`, "PATCH", { income }),
};

export const expensesApi = {
  getExpensesForMonth: (month: string) =>
    request<Expense[]>(`/api/expenses/month/${month}`),

  getAllExpenses: () => request<Expense[]>("/api/expenses/all"),

  createExpense: (
    month: string,
    data: {
      name: string;
      amount: number;
      type: "NEED" | "WANT";
      category: string;
      is_recurring?: boolean;
      date: string;
      note?: string;
    }
  ) => request<Expense>(`/api/expenses/month/${month}`, "POST", data),

  updateExpense: (
    id: number,
    data: Partial<{
      name: string;
      amount: number;
      type: "NEED" | "WANT";
      category: string;
      is_recurring: boolean;
      date: string;
      note: string;
    }>
  ) => request<Expense>(`/api/expenses/${id}`, "PATCH", data),

  deleteExpense: (id: number) =>
    request<void>(`/api/expenses/${id}`, "DELETE"),
};

export const goalsApi = {
  getGoals: () => request<Goal[]>("/api/goals/"),

  getGoal: (id: number) => request<Goal>(`/api/goals/${id}`),

  createGoal: (data: {
    name: string;
    target_amount: number;
    deadline_months: number;
  }) => request<Goal>("/api/goals/", "POST", data),

  updateGoal: (
    id: number,
    data: Partial<{
      name: string;
      target_amount: number;
      deadline_months: number;
    }>
  ) => request<Goal>(`/api/goals/${id}`, "PATCH", data),

  markAchieved: (id: number) => request<Goal>(`/api/goals/${id}/achieve`, "PATCH"),

  pauseGoal: (id: number) => request<Goal>(`/api/goals/${id}/pause`, "PATCH"),

  deleteGoal: (id: number) => request<void>(`/api/goals/${id}`, "DELETE"),
};

export const contributionsApi = {
  createContribution: (data: {
    goal_id: number;
    month: string;
    amount_contributed: number;
  }) => request<GoalContribution>("/api/contributions/", "POST", data),

  updateContribution: (id: number, amount_contributed: number) =>
    request<GoalContribution>(`/api/contributions/${id}`, "PATCH", {
      amount_contributed,
    }),

  deleteContribution: (id: number) =>
    request<void>(`/api/contributions/${id}`, "DELETE"),

  getContributionsForGoal: (goal_id: number) =>
    request<GoalContribution[]>(`/api/contributions/goal/${goal_id}`),
};

export const recurringApi = {
  getTemplates: () => request<RecurringTemplate[]>("/api/recurring/"),

  createTemplate: (data: {
    name: string;
    amount: number;
    category: string;
    type: string;
  }) => request<RecurringTemplate>("/api/recurring/", "POST", data),

  deleteTemplate: (id: number) =>
    request<void>(`/api/recurring/${id}`, "DELETE"),

  getSuggestionsForMonth: (month: string) =>
    request<RecurringTemplate[]>(`/api/recurring/suggest/${month}`),
};

export const deferredApi = {
  getDeferredWants: () => request<DeferredWant[]>("/api/deferred/"),

  createDeferredWant: (data: {
    name: string;
    estimated_cost: number;
  }) => request<DeferredWant>("/api/deferred/", "POST", data),

  deleteDeferredWant: (id: number) =>
    request<void>(`/api/deferred/${id}`, "DELETE"),
};

export const recommendationsApi = {
  getRecommendations: (month: string) =>
    request<RecommendationsResponse>(`/api/recommendations/${month}`),

  checkImpulseSpend: (month: string, expense_id: number) =>
    request<{ recommendation: Recommendation | null }>(
      `/api/recommendations/${month}/impulse/${expense_id}`
    ),
};