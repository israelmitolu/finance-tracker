import React from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, calculateBudgetPercentage } from '../../utils/helpers';

const MonthSelector: React.FC = () => {
  const { currentMonth, setCurrentMonth } = useFinance();
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(e.target.value);
  };
  
  // Generate month options for the current year and previous year
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Add months for current year
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const monthStr = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'long' });
      options.push({ value: monthStr, label: `${monthName} ${currentYear}` });
    }
    
    // Add months for previous year
    const prevYear = currentYear - 1;
    for (let month = 0; month < 12; month++) {
      const date = new Date(prevYear, month, 1);
      const monthStr = `${prevYear}-${String(month + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'long' });
      options.push({ value: monthStr, label: `${monthName} ${prevYear}` });
    }
    
    return options;
  };
  
  const monthOptions = getMonthOptions();
  
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 border border-gray-100 dark:border-gray-700">
      <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
      <select
        value={currentMonth}
        onChange={handleMonthChange}
        className="bg-transparent border-none text-gray-700 dark:text-gray-300 focus:ring-0 font-medium pr-8"
      >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const DashboardHeader: React.FC = () => {
  const { monthlyData, preferences } = useFinance();
  const { totalExpenses, totalIncome } = monthlyData;
  const budgetPercentage = calculateBudgetPercentage(preferences.monthlyBudget, totalExpenses);
  const budgetRemaining = Math.max(0, preferences.monthlyBudget - totalExpenses);
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
          Monthly Overview
        </h2>
        <MonthSelector />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {formatCurrency(totalIncome, preferences.currency)}
              </p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <ArrowUpRight className="text-green-500 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>
        
        {/* Expenses Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {formatCurrency(totalExpenses, preferences.currency)}
              </p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <ArrowDownRight className="text-red-500 dark:text-red-400" size={20} />
            </div>
          </div>
        </div>
        
        {/* Budget Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</p>
              <p className="text-sm font-medium">
                {formatCurrency(budgetRemaining, preferences.currency)} left
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  budgetPercentage > 90 ? 'bg-red-500' : 
                  budgetPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{budgetPercentage}% used</span>
              <span>{formatCurrency(preferences.monthlyBudget, preferences.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;