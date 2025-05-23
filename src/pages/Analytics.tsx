import React from 'react';
import MonthlyTrendsChart from '../components/analytics/MonthlyTrendsChart';
import CategoryComparisonChart from '../components/analytics/CategoryComparisonChart';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrendsChart />
        <CategoryComparisonChart />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Insights</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h4 className="font-medium text-indigo-700 dark:text-indigo-400 mb-2">Spending Patterns</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Your highest spending category is typically Food & Dining, accounting for about 30% of your monthly expenses.
            </p>
          </div>
          
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <h4 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2">Savings Opportunities</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Reducing your Entertainment expenses by 15% could save you approximately $45 per month, or $540 annually.
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Budget Status</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              You're currently on track with your monthly budget. Keep up the good work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;