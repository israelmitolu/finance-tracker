// Types for the finance application
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  type: 'expense' | 'income';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget?: number;
}

export interface MonthlyData {
  month: string; // Format: YYYY-MM
  totalExpenses: number;
  totalIncome: number;
  categorySummary: {
    [categoryId: string]: number;
  };
}

export interface UserPreferences {
  currency: string;
  monthlyBudget: number;
  darkMode: boolean;
}

export type View = 'dashboard' | 'transactions' | 'analytics' | 'categories' | 'settings';

export type Period = 'day' | 'week' | 'month' | 'year';