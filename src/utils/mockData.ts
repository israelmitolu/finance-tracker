// Mock data for the finance application
import { Transaction, Category, UserPreferences } from '../types';
import { generateId } from './helpers';

export const mockCategories: Category[] = [
  {
    id: 'cat-food',
    name: 'Food & Dining',
    color: '#F97316', // Orange
    icon: 'Utensils'
  },
  {
    id: 'cat-transport',
    name: 'Transportation',
    color: '#3B82F6', // Blue
    icon: 'Car'
  },
  {
    id: 'cat-housing',
    name: 'Housing',
    color: '#8B5CF6', // Purple
    icon: 'Home'
  },
  {
    id: 'cat-utilities',
    name: 'Utilities',
    color: '#10B981', // Green
    icon: 'Lightbulb'
  },
  {
    id: 'cat-entertainment',
    name: 'Entertainment',
    color: '#EC4899', // Pink
    icon: 'Film'
  },
  {
    id: 'cat-shopping',
    name: 'Shopping',
    color: '#6366F1', // Indigo
    icon: 'ShoppingBag'
  },
  {
    id: 'cat-health',
    name: 'Health',
    color: '#EF4444', // Red
    icon: 'Heart'
  },
  {
    id: 'cat-education',
    name: 'Education',
    color: '#F59E0B', // Amber
    icon: 'GraduationCap'
  },
  {
    id: 'cat-income',
    name: 'Income',
    color: '#16A34A', // Green
    icon: 'DollarSign'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: generateId(),
    amount: 32.50,
    category: 'cat-food',
    description: 'Grocery shopping',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 45.00,
    category: 'cat-transport',
    description: 'Gas',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 1200.00,
    category: 'cat-housing',
    description: 'Rent',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 80.00,
    category: 'cat-utilities',
    description: 'Electricity bill',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 60.00,
    category: 'cat-entertainment',
    description: 'Movie and dinner',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 120.00,
    category: 'cat-shopping',
    description: 'New clothes',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 3000.00,
    category: 'cat-income',
    description: 'Salary',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'income'
  },
  {
    id: generateId(),
    amount: 25.00,
    category: 'cat-food',
    description: 'Restaurant',
    date: new Date().toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 200.00,
    category: 'cat-health',
    description: 'Doctor visit',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  },
  {
    id: generateId(),
    amount: 50.00,
    category: 'cat-education',
    description: 'Online course',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense'
  }
];

export const mockUserPreferences: UserPreferences = {
  currency: 'NGN',
  monthlyBudget: 2500,
  darkMode: true
};