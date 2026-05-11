export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'need' | 'want' | 'income';
  date: string;
  time?: string;
  paymentMethod?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: 'in-progress' | 'achieved';
  monthlyTarget: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  income: number;
  needs: number;
  wants: number;
  saved: number;
  healthScore: number;
  topCategory: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Whole Foods Market',
    amount: 12450,
    category: 'Groceries',
    type: 'need',
    date: '2026-04-09',
    time: '10:42 AM',
    paymentMethod: 'HDFC Credit'
  },
  {
    id: '2',
    name: 'Utility Corp - Electricity',
    amount: 4200,
    category: 'Utilities',
    type: 'need',
    date: '2026-04-08',
    paymentMethod: 'Direct Debit'
  },
  {
    id: '3',
    name: 'Salary Deposit',
    amount: 75000,
    category: 'Work',
    type: 'income',
    date: '2026-04-07',
    paymentMethod: 'System Transfer'
  },
  {
    id: '4',
    name: 'Netflix Subscription',
    amount: 649,
    category: 'Entertainment',
    type: 'want',
    date: '2026-04-05',
    paymentMethod: 'Auto-pay'
  },
  {
    id: '5',
    name: 'The Glen Fine Dining',
    amount: 4250,
    category: 'Dining',
    type: 'want',
    date: '2026-04-04',
    paymentMethod: 'Amex Gold'
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Europe Summer Trip 2025',
    targetAmount: 175000,
    currentAmount: 114000,
    deadline: '2025-08-01',
    category: 'Travel',
    status: 'in-progress',
    monthlyTarget: 2833
  },
  {
    id: '2',
    name: 'Home Renovation Fund',
    targetAmount: 300000,
    currentAmount: 125000,
    deadline: '2026-12-01',
    category: 'Housing',
    status: 'in-progress',
    monthlyTarget: 10416
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    targetAmount: 85000,
    currentAmount: 42500,
    deadline: '2026-09-01',
    category: 'Technology',
    status: 'in-progress',
    monthlyTarget: 5400
  }
];

export const mockHistory: MonthlySummary[] = [
  {
    month: 'March',
    year: 2026,
    income: 240000,
    needs: 84320,
    wants: 155680,
    saved: 155680,
    healthScore: 88,
    topCategory: 'Rent'
  },
  {
    month: 'February',
    year: 2026,
    income: 75000,
    needs: 32000,
    wants: 12000,
    saved: 31000,
    healthScore: 72,
    topCategory: 'Dining'
  }
];
