// Helper functions for the finance application
import { Transaction, Category, MonthlyData } from '../types';

// Format currency based on user's locale
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Get current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Extract month from date string in YYYY-MM format
export const getMonthFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// Calculate total expenses for a period
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate total income for a period
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Group transactions by category and calculate totals
export const getCategoryTotals = (
  transactions: Transaction[],
  categories: Category[]
): { categoryId: string; name: string; color: string; amount: number }[] => {
  const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
  
  // Initialize map with all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { 
      name: category.name, 
      color: category.color,
      amount: 0 
    });
  });
  
  // Sum up transactions by category
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const categoryData = categoryMap.get(transaction.category);
      if (categoryData) {
        categoryData.amount += transaction.amount;
      }
    });
  
  // Convert map to array
  return Array.from(categoryMap.entries()).map(([categoryId, data]) => ({
    categoryId,
    name: data.name,
    color: data.color,
    amount: data.amount
  }));
};

// Calculate monthly data for charts and analysis
export const calculateMonthlyData = (
  transactions: Transaction[],
  month: string
): MonthlyData => {
  const monthlyTransactions = transactions.filter(
    t => getMonthFromDate(t.date) === month
  );
  
  const categorySummary: { [categoryId: string]: number } = {};
  
  monthlyTransactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      if (!categorySummary[transaction.category]) {
        categorySummary[transaction.category] = 0;
      }
      categorySummary[transaction.category] += transaction.amount;
    });
  
  return {
    month,
    totalExpenses: calculateTotalExpenses(monthlyTransactions),
    totalIncome: calculateTotalIncome(monthlyTransactions),
    categorySummary
  };
};

// Get transactions for a specific date
export const getTransactionsForDate = (
  transactions: Transaction[],
  date: string
): Transaction[] => {
  const targetDate = new Date(date).toISOString().split('T')[0];
  return transactions.filter(t => 
    new Date(t.date).toISOString().split('T')[0] === targetDate
  );
};

// Calculate budget remaining
export const calculateBudgetRemaining = (budget: number, spent: number): number => {
  return Math.max(0, budget - spent);
};

// Calculate percentage of budget used
export const calculateBudgetPercentage = (budget: number, spent: number): number => {
  if (budget <= 0) return 100;
  return Math.min(100, Math.round((spent / budget) * 100));
};