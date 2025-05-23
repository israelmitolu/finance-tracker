import React, { createContext, useState, useContext, useEffect } from "react";
import {
  Transaction,
  Category,
  UserPreferences,
  View,
  MonthlyData,
} from "../types";
import {
  generateId,
  getCurrentMonth,
  calculateMonthlyData,
} from "../utils/helpers";

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  preferences: UserPreferences;
  currentView: View;
  currentMonth: string;
  monthlyData: MonthlyData;

  // Actions
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setCurrentView: (view: View) => void;
  setCurrentMonth: (month: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    currency: "USD",
    monthlyBudget: 0,
    darkMode: false,
  });
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    month: currentMonth,
    totalExpenses: 0,
    totalIncome: 0,
    categorySummary: {},
  });

  // Load initial data from localStorage
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    const storedCategories = localStorage.getItem("categories");
    const storedPreferences = localStorage.getItem("preferences");

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }

    if (storedPreferences) {
      const loadedPreferences = JSON.parse(storedPreferences);
      setPreferences(loadedPreferences);
      // Apply dark mode on initial load
      if (loadedPreferences.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
    // Apply dark mode whenever preferences change
    if (preferences.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferences]);

  // Calculate monthly data whenever transactions or current month changes
  useEffect(() => {
    const data = calculateMonthlyData(transactions, currentMonth);
    setMonthlyData(data);
  }, [transactions, currentMonth]);

  // Transaction actions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: generateId() };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...transaction } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Category actions
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: `cat-${generateId()}` };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...category } : c))
    );
  };

  const deleteCategory = (id: string) => {
    // Don't delete a category if it has transactions
    const hasTransactions = transactions.some((t) => t.category === id);
    if (hasTransactions) {
      // In a real app, we'd show an error message here
      console.error("Cannot delete category with existing transactions");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Preferences actions
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  const value = {
    transactions,
    categories,
    preferences,
    currentView,
    currentMonth,
    monthlyData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    updatePreferences,
    setCurrentView,
    setCurrentMonth,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
